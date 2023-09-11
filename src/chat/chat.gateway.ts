import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import * as redis from 'redis';
import { config } from 'dotenv';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private redisClient: any;
  private clearRedisMessages() {
    this.redisClient.del('messages', (err, reply) => {
      if (err) {
        this.logger.error('Failed to clear Redis messages');
      } else {
        this.logger.log('Redis messages cleared');
      }
    });
  }

  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.PASSWORD,
    });
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.redisClient.lpush('messages', text);
    this.server.emit('msgToClient', [text]);
  }

  afterInit(server: Server) {
    this.logger.log('Init');

    const now = new Date();
    const delayUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;

    setTimeout(() => {
      this.clearRedisMessages();
      setInterval(
        () => {
          this.clearRedisMessages();
        },
        1000 * 60 * 60,
      ); // 매 1시간마다 초기화
    }, delayUntilNextHour); // 정각까지 대기
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.redisClient.lrange('messages', 0, -1, (err, reply) => {
      client.emit('msgToClient', reply);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

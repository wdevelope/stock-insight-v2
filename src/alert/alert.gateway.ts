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

@WebSocketGateway()
export class AlertGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('alertGateway');
  private redisClient: any;

  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.PASSWORD,
    });
  }

  @SubscribeMessage('ntcToServer')
  handleMessage(client: Socket, text: string): void {
    this.redisClient.set('notice', text, 'EX', 90);
    this.server.emit('ntcToClient', text);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.redisClient.get('notice', (err, reply) => {
      if (err) {
        client.emit('ntcToClient', '오류가 발생했습니다.');
      } else {
        client.emit('ntcToClient', reply);
      }
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

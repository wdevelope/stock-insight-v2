import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from './redis.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('chat message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const message = JSON.stringify(payload);

    // Save the message in Redis
    await this.redisService.addMessage(message);

    // Send the message to all connected clients
    this.server.emit('chat message', payload);
  }
}

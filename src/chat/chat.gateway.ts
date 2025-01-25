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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private messages: string[] = [];

  private clearMessages() {
    this.messages = [];
    this.logger.log('Messages cleared');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.messages.push(text);
    this.server.emit('msgToClient', [text]);
  }

  afterInit(server: Server) {
    this.logger.log('Init');

    const now = new Date();
    const delayUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;

    setTimeout(() => {
      this.clearMessages();
      setInterval(
        () => {
          this.clearMessages();
        },
        1000 * 60 * 60,
      ); // 매 1시간마다 초기화
    }, delayUntilNextHour); // 정각까지 대기
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('msgToClient', this.messages);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onLineMap } from './onLineMap';
import { MessageBody } from '@nestjs/websockets';

// @WebSocketGateway(80, { namespace: /\/ws-.+/ })
// export class EventsGateway
//   implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
// {
//   @WebSocketServer() public server: Server;

//   @SubscribeMessage('test')
//   handleTest(@MessageBody() data: string) {
//     console.log('test', data);
//   }

//   @SubscribeMessage('test')
//   handleLogin(
//     @MessageBody() data: { id: number; channels: number[] },
//     @ConnectedSocket() socket: Socket,
//   ) {
//     const newNamespace = socket.nsp;
//     console.log('Login', newNamespace);
//     onLineMap[socket.nsp.name][socket.id] = data.id;
//     newNamespace.emit('onLineList', Object.values(onLineMap[socket.nsp.name]));
//     data.channels.forEach((channel: number) => {
//       console.log('join', socket.nsp.name, channel);
//       socket.join(`${socket.nsp.name}-${channel}`);
//     });
//   }

//   afterInit(server: Server): any {
//     console.log('websocketsever init', server);
//   }

//   handleConnection(@ConnectedSocket() socket: Socket): any {
//     console.log(`connected`, socket.nsp.name);
//     if (!onLineMap[socket.nsp.name]) {
//       onLineMap[socket.nsp.name] = {};
//     }
//     socket.emit('hello', socket.nsp.name);
//   }

//   handleDisconnect(@ConnectedSocket() socket: Socket): any {
//     console.log(`disconnected`, socket.nsp.name);
//     const newNamespace = socket.nsp;
//     delete onLineMap[socket.nsp.name][socket.id];
//     newNamespace.emit('onLineList', Object.values(onLineMap[socket.nsp.name]));
//   }
// }

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}

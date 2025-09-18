import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  username: string;
  room: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private users: Map<string, User> = new Map();
  private activeRooms: Set<string> = new Set(['general']);

  // Handle new client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.users.set(client.id, { id: client.id, username: 'Anonymous', room: 'general' });
    client.emit('connected', { message: 'Successfully connected to chat server' });
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const username = this.users.get(client.id);
    if (username) {
      this.server.emit('userLeft', { username, id: client.id });
    }
    this.users.delete(client.id);
  }

  // Join a chat room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { room: string; username: string }) {
    // Leave any existing rooms
    client.rooms.forEach(room => {
      if (room !== client.id) {
        client.leave(room);
      }
    });

    // Join new room
    client.join(data.room);
    this.users.set(client.id, { id: client.id, username: data.username, room: data.room });
    this.activeRooms.add(data.room);
    
    // Notify room about new user
    client.to(data.room).emit('userJoined', { 
      username: data.username, 
      room: data.room,
      timestamp: new Date()
    });

    return { 
      event: 'joinedRoom',
      data: { 
        message: `Successfully joined ${data.room}`,
        room: data.room,
        username: data.username
      }
    };
  }

  // Handle new messages
  @SubscribeMessage('chatMessage')
  handleMessage(client: Socket, data: { room: string; message: string; username: string }) {
    const user = this.users.get(client.id);
    if (!user) {
      return { event: 'error', data: { message: 'User not found. Please rejoin the chat.' } };
    }

    const messageData = {
      username: data.username || user.username || 'Anonymous',
      message: data.message,
      timestamp: new Date(),
      room: data.room
    };
    
    // Broadcast message to everyone in the room including the sender
    this.server.to(data.room).emit('message', messageData);
    
    return { 
      event: 'messageSent',
      data: { success: true, ...messageData }
    };
  }

  // Get list of active rooms
  @SubscribeMessage('getRooms')
  handleGetRooms() {
    return {
      event: 'roomList',
      data: {
        rooms: Array.from(this.activeRooms)
      }
    };
  }
}

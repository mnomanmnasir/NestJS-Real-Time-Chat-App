"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = exports.ChatGateway = class ChatGateway {
    constructor() {
        this.users = new Map();
        this.activeRooms = new Set(['general']);
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        this.users.set(client.id, { id: client.id, username: 'Anonymous', room: 'general' });
        client.emit('connected', { message: 'Successfully connected to chat server' });
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        const username = this.users.get(client.id);
        if (username) {
            this.server.emit('userLeft', { username, id: client.id });
        }
        this.users.delete(client.id);
    }
    handleJoinRoom(client, data) {
        client.rooms.forEach(room => {
            if (room !== client.id) {
                client.leave(room);
            }
        });
        client.join(data.room);
        this.users.set(client.id, { id: client.id, username: data.username, room: data.room });
        this.activeRooms.add(data.room);
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
    handleMessage(client, data) {
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
        this.server.to(data.room).emit('message', messageData);
        return {
            event: 'messageSent',
            data: { success: true, ...messageData }
        };
    }
    handleGetRooms() {
        return {
            event: 'roomList',
            data: {
                rooms: Array.from(this.activeRooms)
            }
        };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chatMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getRooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleGetRooms", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true
        },
        namespace: '/chat'
    })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
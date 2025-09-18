import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private users;
    private activeRooms;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        room: string;
        username: string;
    }): {
        event: string;
        data: {
            message: string;
            room: string;
            username: string;
        };
    };
    handleMessage(client: Socket, data: {
        room: string;
        message: string;
        username: string;
    }): {
        event: string;
        data: {
            message: string;
        };
    } | {
        event: string;
        data: {
            username: string;
            message: string;
            timestamp: Date;
            room: string;
            success: boolean;
        };
    };
    handleGetRooms(): {
        event: string;
        data: {
            rooms: string[];
        };
    };
}

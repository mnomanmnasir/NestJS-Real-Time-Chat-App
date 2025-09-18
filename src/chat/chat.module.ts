// This module groups the chat-related providers (Gateway/services) together
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway'; // Socket.IO gateway that handles real-time events

@Module({
  // providers are classes Nest can instantiate and inject
  providers: [ChatGateway],
  // export makes the gateway available to other modules if needed
  exports: [ChatGateway]
})
export class ChatModule {}

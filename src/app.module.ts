// Root application module: wires together controllers and feature modules
import { Module } from '@nestjs/common';
// Simple controller that serves a basic GET endpoint at '/'
import { AppController } from './app.controller';
// Module to serve static files (HTML/CSS/JS) from a folder
import { ServeStaticModule } from '@nestjs/serve-static';
// Node's path helper to safely build the absolute path to the public directory
import { join } from 'path';
// Our chat feature (WebSocket Gateway lives inside this module)
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Serve files under /public at the web root (http://host:3000/)
    // For example: public/test-client.html -> http://host:3000/test-client.html
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // absolute path to /public
      serveRoot: '/', // mount at web root
    }),
    ChatModule,
  ],
  // Controllers handle HTTP requests (REST endpoints)
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
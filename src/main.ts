// Top-level bootstrap file for starting the NestJS application.
// We import the required Nest factories and platform adapters.
import { NestFactory } from '@nestjs/core'; // Creates the Nest application instance
import { AppModule } from './app.module'; // Root application module where modules/controllers/providers are wired
import { NestExpressApplication } from '@nestjs/platform-express'; // Use Express-based Nest application (adds static assets, views, etc.)
import { join } from 'path'; // Node path utility to build OS-agnostic paths
import { IoAdapter } from '@nestjs/platform-socket.io'; // WebSocket adapter (Socket.IO) for real-time communication

// This function boots (starts) the server.
async function bootstrap() {
  // Create a Nest application instance using the Express platform.
  // AppModule is the root module that aggregates the rest of the app.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS (Cross-Origin Resource Sharing) so that the browser
  // can call your API/WS from a different origin (e.g., your test HTML).
  // In development we allow any origin for convenience.
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Serve static files from the "public" directory (e.g., images, HTML, JS, CSS).
  // That lets you place files in /public and access them via http://host:3000/<file>
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Register the Socket.IO adapter so Gateways can use WebSockets.
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Start HTTP server on port 3000. By default it binds to 127.0.0.1 (localhost).
  // Note: If you want to access from another device on the LAN (e.g., your phone),
  // you can bind to all interfaces by using: await app.listen(3000, '0.0.0.0')
  await app.listen(3000);

  // Helpful console logs for where the app and WebSocket server are running.
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`WebSocket server running on: ws://localhost:3000/chat`);
}

bootstrap();
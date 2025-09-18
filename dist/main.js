"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
    console.log(`WebSocket server running on: ws://localhost:3000/chat`);
}
bootstrap();
//# sourceMappingURL=main.js.map
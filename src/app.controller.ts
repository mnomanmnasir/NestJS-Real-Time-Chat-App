// A very small HTTP controller to verify the server is up.
import { Controller, Get } from '@nestjs/common'; // Controller and route decorator

// The @Controller() decorator marks this class as a controller.
// Without a path, it is mounted at the root: '/'
@Controller()
export class AppController {
  // @Get() maps HTTP GET requests to this method.
  // Visiting http://host:3000/ will return this string.
  @Get()
  getHello(): string {
    // Return a simple status message; useful for smoke-testing the API.
    return 'NestJS Application is running!';
  }
}
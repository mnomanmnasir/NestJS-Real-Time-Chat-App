// Unit test for ChatGateway: verifies the gateway can be instantiated
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway; // system under test (SUT)

  beforeEach(async () => {
    // Create a lightweight testing module that provides ChatGateway
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    // Retrieve an instance from Nest's DI container
    gateway = module.get<ChatGateway>(ChatGateway);
  });

  // Test that the gateway instance is defined
  it('should be defined', () => {
    // Sanity check: gateway instance should exist
    expect(gateway).toBeDefined();
  });
});

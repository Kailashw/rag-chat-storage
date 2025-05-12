import { Test, TestingModule } from '@nestjs/testing';
import { ChatSessionController } from './chat-session.controller';
import { ChatSessionService } from './chat-session.service';

describe('ChatSessionController', () => {
  let controller: ChatSessionController;

  const mockChatSessionService = {
    createSession: jest.fn().mockResolvedValue({ id: '1', userId: 'user1', title: 'My Chat' }),
    renameSession: jest.fn(),
    markFavorite: jest.fn(),
    deleteSession: jest.fn(),
    getSessions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatSessionController],
      providers: [
        {
          provide: ChatSessionService,
          useValue: mockChatSessionService,
        },
      ],
    }).compile();

    controller = module.get<ChatSessionController>(ChatSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a session', async () => {
    const dto = { userId: 'user1', title: 'My Chat' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: '1', userId: 'user1', title: 'My Chat' });
  });
});

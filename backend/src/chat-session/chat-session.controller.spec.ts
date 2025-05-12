// ✅ Test: ChatSessionController (chat-session.controller.spec.ts)
import { Test, TestingModule } from '@nestjs/testing';
import { ChatSessionController } from './chat-session.controller';
import { ChatSessionService } from './chat-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RenameSessionDto } from './dto/rename-session.dto';

describe('ChatSessionController', () => {
  let controller: ChatSessionController;

  const mockChatSessionService = {
    createSession: jest.fn().mockResolvedValue({ id: '1', userId: 'user1', title: 'My Chat' }),
    renameSession: jest.fn().mockResolvedValue({ id: '1', title: 'Renamed Title' }),
    markFavorite: jest.fn().mockResolvedValue({ id: '1', isFavorite: true }),
    deleteSession: jest.fn().mockResolvedValue({ id: '1' }),
    getSessions: jest.fn().mockResolvedValue([{ id: '1', userId: 'user1', title: 'Chat A' }]),
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
    const dto: CreateSessionDto = { userId: 'user1', title: 'My Chat' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: '1', userId: 'user1', title: 'My Chat' });
  });

  it('should rename a session', async () => {
    const dto: RenameSessionDto = { id: '1', title: 'Renamed Title' };
    const result = await controller.rename('1', dto);
    expect(result.title).toEqual('Renamed Title');
  });

  it('should mark as favorite', async () => {
    const result = await controller.favorite('1', 'true');
    expect(result.isFavorite).toBe(true);
  });

  it('should delete a session', async () => {
    const result = await controller.delete('1');
    expect(result.id).toEqual('1');
  });

  it('should get all sessions for a user', async () => {
    const result = await controller.getAll('user1');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Chat A');
  });
});

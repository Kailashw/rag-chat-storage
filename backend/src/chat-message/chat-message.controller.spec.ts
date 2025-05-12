// ✅ Test: ChatMessageController (chat-message.controller.spec.ts)
import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('ChatMessageController', () => {
  let controller: ChatMessageController;
  let service: ChatMessageService;

  const mockService = {
    addMessage: jest.fn().mockResolvedValue({ id: 'msg-1', content: 'Hello', sender: 'user' }),
    getMessages: jest.fn().mockResolvedValue({
      data: [{ id: 'msg-1', content: 'Hello' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessageController],
      providers: [
        {
          provide: ChatMessageService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ChatMessageController>(ChatMessageController);
    service = module.get<ChatMessageService>(ChatMessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a message', async () => {
    const dto: CreateMessageDto = {
      sessionId: 'sess-1',
      sender: 'user',
      content: 'Hello',
    };
    const result = await controller.create(dto);
    expect(service.addMessage).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('msg-1');
  });

  it('should return messages by session id', async () => {
    const result = await controller.getBySession('sess-1', '1', '10');
    expect(service.getMessages).toHaveBeenCalledWith('sess-1', 1, 10);
    expect(result.data).toHaveLength(1);
  });
});
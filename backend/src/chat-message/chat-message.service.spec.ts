// ✅ Test: ChatMessageService (chat-message.service.spec.ts)
import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageService } from './chat-message.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  chatMessage: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  chatSession: {
    findUnique: jest.fn(),
  },
};

describe('ChatMessageService', () => {
  let service: ChatMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMessageService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ChatMessageService>(ChatMessageService);
  });

  it('should add a message to an existing session', async () => {
    const dto = {
      sessionId: 'sess-1',
      sender: 'user',
      content: 'Hello',
    };
    mockPrisma.chatSession.findUnique.mockResolvedValue({ id: 'sess-1' });
    mockPrisma.chatMessage.create.mockResolvedValue({ id: 'msg-1', ...dto });

    const result = await service.addMessage(dto);
    expect(result.id).toBe('msg-1');
    expect(result.sender).toBe('user');
  });

  it('should throw error if session not found', async () => {
    mockPrisma.chatSession.findUnique.mockResolvedValue(null);

    await expect(
      service.addMessage({ sessionId: 'bad-id', sender: 'user', content: 'X' })
    ).rejects.toThrowError('Chat session not found');
  });

  it('should return paginated messages', async () => {
    const mockMessages = [
      { id: 'msg1', content: 'A' },
      { id: 'msg2', content: 'B' },
    ];
    mockPrisma.chatMessage.findMany.mockResolvedValue(mockMessages);
    mockPrisma.chatMessage.count.mockResolvedValue(2);

    const result = await service.getMessages('sess-1', 1, 10);
    expect(result.data).toHaveLength(2);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(1);
  });
});
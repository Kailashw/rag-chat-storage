import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async addMessage(dto: CreateMessageDto) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) throw new NotFoundException('Chat session not found');

    return this.prisma.chatMessage.create({
      data: {
        ...dto,
      },
    });
  }

  async getMessages(sessionId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.chatMessage.count({ where: { sessionId } }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

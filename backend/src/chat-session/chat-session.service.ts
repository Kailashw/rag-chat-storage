import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class ChatSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(dto: CreateSessionDto) {
    return this.prisma.chatSession.create({
      data: {
        userId: dto.userId,
        title: dto.title || 'Untitled Chat',
      },
    });
  }

  async renameSession(id: string, title: string) {
    return this.prisma.chatSession.update({
      where: { id },
      data: { title },
    });
  }

  async markFavorite(id: string, isFavorite: boolean) {
    return this.prisma.chatSession.update({
      where: { id },
      data: { isFavorite },
    });
  }

  async deleteSession(id: string) {
    await this.prisma.chatMessage.deleteMany({ where: { sessionId: id } });
    return this.prisma.chatSession.delete({ where: { id } });
  }

  async getSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }
}

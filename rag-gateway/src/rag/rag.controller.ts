import { Body, Controller, Post } from '@nestjs/common';
import { RAGService } from './rag.service';

@Controller('rag')
export class RAGController {
  constructor(private readonly ragService: RAGService) {}

  @Post('ask')
  async ask(@Body() body: { sessionId: string; question: string }) {
    return this.ragService.handleRagFlow(body.sessionId, body.question);
  }
}

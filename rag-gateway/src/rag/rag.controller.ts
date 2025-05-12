import { Body, Controller, Post } from '@nestjs/common';
import { RAGService } from './rag.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('RAG')
@Controller('rag')
export class RAGController {
  constructor(private readonly ragService: RAGService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask a question and generate a response with context' })
  @ApiBody({
    schema: {
      example: {
        sessionId: 'abc123',
        question: 'Where is the Eiffel Tower?'
      }
    }
  })
  @Post('ask')
  async ask(@Body() body: { sessionId: string; question: string }) {
    return this.ragService.handleRagFlow(body.sessionId, body.question);
  }
}

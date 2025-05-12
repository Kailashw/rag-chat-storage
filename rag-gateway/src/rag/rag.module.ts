import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { RAGController } from './rag.controller';

@Module({
  controllers: [RAGController],
  providers: [RAGService]
})
export class RagModule {}

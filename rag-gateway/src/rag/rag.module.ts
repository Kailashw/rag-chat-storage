import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { RAGController } from './rag.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], 
  controllers: [RAGController],
  providers: [RAGService]
})
export class RagModule {}

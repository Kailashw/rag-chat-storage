import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'session-uuid' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ example: 'user', description: 'Sender: "user" or "assistant"' })
  @IsString()
  @IsNotEmpty()
  sender: string; // "user" or "assistant"

  @ApiProperty({ example: 'What is RAG?', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'Relevant retrieved context...', required: false })
  @IsOptional()
  @IsString()
  context?: string;
}

import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  sender: string; // "user" or "assistant"

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  context?: string;
}

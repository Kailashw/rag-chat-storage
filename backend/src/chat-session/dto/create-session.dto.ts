import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'user-123', description: 'User ID who owns the session' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'My Session Title', required: false })
  @IsOptional()
  @IsString()
  title?: string;
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Messages')
@ApiHeader({
  name: 'x-api-key',
  required: true,
  description: 'API key for authentication',
})
@Controller('messages')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.chatMessageService.addMessage(dto);
  }

  @Get(':sessionId')
  getBySession(
    @Param('sessionId') sessionId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.chatMessageService.getMessages(sessionId, parseInt(page), parseInt(limit));
  }
}

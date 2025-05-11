import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RenameSessionDto } from './dto/rename-session.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Sessions')
@ApiHeader({
  name: 'x-api-key',
  required: true,
  description: 'API key for authentication',
})
@Controller('sessions')
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Post()
  create(@Body() dto: CreateSessionDto) {
    return this.chatSessionService.createSession(dto);
  }

  @Patch(':id/rename')
  rename(@Param('id') id: string, @Body() dto: RenameSessionDto) {
    return this.chatSessionService.renameSession(id, dto.title);
  }

  @Patch(':id/favorite')
  favorite(@Param('id') id: string, @Query('value') value: string) {
    return this.chatSessionService.markFavorite(id, value === 'true');
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.chatSessionService.deleteSession(id);
  }

  @Get()
  getAll(@Query('userId') userId: string) {
    return this.chatSessionService.getSessions(userId);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RenameSessionDto } from './dto/rename-session.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Create a new chat session' })
  @ApiBody({ type: CreateSessionDto })
  create(@Body() dto: CreateSessionDto) {
    return this.chatSessionService.createSession(dto);
  }

  @Patch(':id/rename')
  @ApiOperation({ summary: 'Rename an existing chat session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiBody({ type: RenameSessionDto })
  rename(@Param('id') id: string, @Body() dto: RenameSessionDto) {
    return this.chatSessionService.renameSession(id, dto.title);
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Mark or unmark a chat session as favorite' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({ name: 'value', description: 'Set to true or false', required: true })
  favorite(@Param('id') id: string, @Query('value') value: string) {
    return this.chatSessionService.markFavorite(id, value === 'true');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat session and its messages' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  delete(@Param('id') id: string) {
    return this.chatSessionService.deleteSession(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions for a given user' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  getAll(@Query('userId') userId: string) {
    return this.chatSessionService.getSessions(userId);
  }
}

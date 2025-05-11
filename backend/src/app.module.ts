import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
import { ChatMessageModule } from './chat-message/chat-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ChatSessionModule,
    ChatMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: process.env.THROTTLE_TTL
            ? parseInt(process.env.THROTTLE_TTL)
            : 60,
          limit: process.env.THROTTLE_LIMIT
            ? parseInt(process.env.THROTTLE_LIMIT)
            : 100,
        },
      ],
    }),
    PrismaModule,
    ChatSessionModule,
    ChatMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}

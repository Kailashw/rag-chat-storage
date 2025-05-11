import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './auth/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalGuards(new ApiKeyGuard(config));

  // Swagger setup
  const configs = new DocumentBuilder()
    .setTitle('RAG Chat Storage API')
    .setDescription('Manages chat sessions and messages for RAG-based systems')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'x-api-key'
    )
    .build();

  const document = SwaggerModule.createDocument(app, configs);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();

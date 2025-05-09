import { Logger, ValidationPipe, ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from './config/environment.validation';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter(),
    { 
      logger: new ConsoleLogger({ json: true, colors: process.env.NODE_ENV === Environment.Development }) 
    }
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API for managing orders')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

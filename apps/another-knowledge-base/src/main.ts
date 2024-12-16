import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import { EnvCheckerFunction, EnvTransformedValues, swaggerBuildConfigFunction } from '@pvz-backends/shared';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // dotenv
  config();

  EnvCheckerFunction();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true
  });
  app.useBodyParser('json', { limit: '8mb' });
  app.enableCors({ credentials: true, origin: true });
  const globalPrefix = '';
  if (globalPrefix.length > 0) {
    app.setGlobalPrefix(globalPrefix);
  }

  if (EnvTransformedValues().production().value === false) {
    const swaggerConfig = swaggerBuildConfigFunction(
      'Another Knowledge Base',
      app,
      globalPrefix
    );
    SwaggerModule.setup(
      swaggerConfig.path,
      swaggerConfig.app,
      swaggerConfig.document,
      swaggerConfig.options
    );
  }

  const port = EnvTransformedValues().another_knowledge_base_app_port().value;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

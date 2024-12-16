import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export function swaggerBuildConfigFunction(
  swaggerTitle: string,
  app: NestExpressApplication,
  globalPrefix: string
) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setVersion('1.0')
    // .setBasePath(globalPrefix)
    .addBearerAuth(
      {
        name: 'x-token',
        type: 'apiKey',
        in: 'header',
        'x-tokenName': 'x-token'
      },
      'x-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  return {
    path: 'swagger',
    app: app,
    document: document,
    options: {
      useGlobalPrefix: true,
      swaggerOptions: {
        persistAuthorization: true
      }
    }
  };
}

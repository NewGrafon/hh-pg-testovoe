import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigBuilderFunction, typeormConfigBuilderFunction } from '@testovoe/shared';
import { CacheWrapperModule } from '@testovoe/cache-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@testovoe/auth-module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { ArticleEntity } from './articles/entities/article.entity';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      typeormConfigBuilderFunction(process.env, [
        ArticleEntity,
        UserEntity
      ])
    ),
    JwtModule.registerAsync(jwtConfigBuilderFunction()),
    CacheWrapperModule,
    AuthModule,
    ArticlesModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      })
    }
  ]
})
export class AppModule {
}

import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  EnvTransformedValues,
  ExceptionMessages,
  IS_DEVELOPMENT_CONTROLLER,
  IS_PUBLIC_KEY,
  ONLY_ANON_KEY,
  PayloadInterface,
  ResponseItem,
  UserFromPayloadInterface
} from '@testovoe/shared';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {
  }

  private readonly isProduction = (): boolean =>
    EnvTransformedValues().production().value;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isDevController(context) && this.isProduction()) {
      const isDevControllerError: ResponseItem<null> = {
        success: false,
        item: null,
        message: ExceptionMessages.IsDevController
      };
      throw new BadRequestException(isDevControllerError);
    }

    const request = context.switchToHttp().getRequest();
    let xtoken = this.extractTokenFromHeader(request);
    let payload: PayloadInterface | undefined = undefined;
    let user: (UserFromPayloadInterface & { userId?: number }) | undefined = undefined;

    if (xtoken) {
      const predictedErrorResponse = {
        success: true,
        message: 'Неизвестная ошибка.'
      };

      try {
        payload = await this.jwtService.verifyAsync<PayloadInterface>(xtoken, {
          secret: EnvTransformedValues().secret_word().value
        });

        if (payload && typeof payload?.id !== 'undefined') {
          user = await this.getUserFromDataSource(payload);
          if (user?.id !== undefined) {
            user.userId = user.id;
            request['user'] = user;
            request.userId = payload.id;
          }
        }
      } catch (e) {
        // console.error(e);
        predictedErrorResponse.success = false;
        user = undefined;
        xtoken = undefined;
        payload = undefined;
      }

      if (!predictedErrorResponse.success) {
        throw new UnauthorizedException(predictedErrorResponse);
      }
    }

    if (this.isPublic(context)) {
      return true;
    }

    if (this.onlyAnonymous(context)) {
      return xtoken === undefined || xtoken?.length === 0 || !!user?.deleted;
    }

    const unauthorizedErrorObject: ResponseItem<null> = {
      success: false,
      item: null,
      message: ExceptionMessages.Unauthorized
    };

    if (!payload || !user) {
      throw new UnauthorizedException(unauthorizedErrorObject);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return (
      request.headers['X-Token'] || request.headers['x-token']
    )?.toString();
  }

  private async getUserFromDataSource(payload: PayloadInterface) {
    return this.dataSource
      .createQueryBuilder()
      .select(['id', 'email', 'deleted'])
      .from<UserFromPayloadInterface>('users', 'user')
      .where('id = :id', { id: payload.id })
      .andWhere('email = :email', { email: payload.email })
      // .cache({
      //   id: DB_USER_AUTH_KEY(payload.id, payload.email),
      //   milliseconds: 2000
      // })
      .getRawOne();
  }

  private isDevController(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_DEVELOPMENT_CONTROLLER, [
        context.getHandler(),
        context.getClass()
      ]) || false
    );
  }

  private isPublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ]) || false
    );
  }

  private onlyAnonymous(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(ONLY_ANON_KEY, [
        context.getHandler(),
        context.getClass()
      ]) || false
    );
  }
}

import { Global, Module } from '@nestjs/common';
import { CacheWrapperService } from './cache-wrapper.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EnvTransformedValues } from '@testovoe/shared';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: false,
      imports: [],
      inject: [],
      useFactory: async () => {
        return Object.assign(
          {
            ttl: 120
          },
          EnvTransformedValues().redis_enabled().value
            ? {
              store: redisStore,
              host: EnvTransformedValues().redis_host().value,
              port: EnvTransformedValues().redis_port(6379),
              user: 'default',
              password: EnvTransformedValues().redis_password().value
            }
            : {}
        );
      }
    })
  ],
  providers: [CacheWrapperService],
  exports: [CacheWrapperService]
})
export class CacheWrapperModule {
}

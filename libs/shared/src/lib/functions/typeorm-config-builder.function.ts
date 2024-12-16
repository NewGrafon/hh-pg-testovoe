/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';
import { EnvTransformedValues } from '../consts-configs/env.configs';

export function typeormConfigBuilderFunction(
  env: NodeJS.ProcessEnv,
  _entities: MixedList<string | Function | EntitySchema>
): TypeOrmModuleAsyncOptions {
  return {
    imports: [],
    useFactory: () => {
      return {
        type: 'postgres',
        host: EnvTransformedValues(env).db_host().value,
        port: EnvTransformedValues(env).db_port().value,
        username: EnvTransformedValues(env).db_username().value,
        password: EnvTransformedValues(env).db_password().value,
        database: EnvTransformedValues(env).db_database().value,
        charset: 'utf8mb4_general_ci',
        ssl: EnvTransformedValues(env).db_ssl().value ? {
          ca: EnvTransformedValues(env).db_ssl_ca().value
        } : undefined,
        entities: _entities,

        // important, don't change this to true
        synchronize: false
      };
    },
    inject: []
  };
}

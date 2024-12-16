import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { EnvCheckerFunction, EnvTransformedValues } from '@pvz-backends/shared';

//dotenv
config({
  path: '../.env'
});

EnvCheckerFunction();

export const typeormDataSource = new DataSource({
  type: 'postgres',
  host: EnvTransformedValues().db_host().value,
  port: EnvTransformedValues().db_port().value,
  username: EnvTransformedValues().db_username().value,
  password: EnvTransformedValues().db_password().value,
  database: EnvTransformedValues().db_database().value,
  ssl: EnvTransformedValues().db_ssl().value ? {
    ca: EnvTransformedValues().db_ssl_ca().value
  } : undefined,
  entities: ['./apps/another-knowledge-base/**/*.entity.ts'],
  migrations: ['./apps/another-knowledge-base/src/migrations/*.ts'],
  migrationsTableName: 'migrations'
});

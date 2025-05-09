import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const getPostgresBaseConfig = (env = process.env): PostgresConnectionOptions => ({
  type: 'postgres',
  host: env.DATABASE_HOST || 'localhost',
  port: parseInt(env.DATABASE_PORT || '5432'),
  username: env.DATABASE_USER || 'postgres',
  password: env.DATABASE_PASSWORD || 'postgres',
  database: env.DATABASE_NAME || 'orders_db',
  entities: [join(__dirname, '..', '..', 'domain', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
});
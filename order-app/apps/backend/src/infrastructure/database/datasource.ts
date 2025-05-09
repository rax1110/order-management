import { DataSource } from 'typeorm';
import { getPostgresBaseConfig } from './config';

const baseConfig = getPostgresBaseConfig();

export default new DataSource({
  ...baseConfig,
  synchronize: false,
  logging: false,
});
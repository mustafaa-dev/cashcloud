import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '@app/common/config/database.config';

export const config: DataSourceOptions = {
  host: DB_HOST,
  type: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: +DB_PORT,
  database: DB_NAME,
  migrations: [path.join('seeds', '*{.js,.ts}')],
};

const dataSource = new DataSource(config);
export default dataSource;

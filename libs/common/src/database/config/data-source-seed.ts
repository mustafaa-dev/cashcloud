import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from '@app/common/database/config/db';

export const config: DataSourceOptions = {
  host: DB_HOST,
  type: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: +DB_PORT,
  database: DB_NAME,
  entities: [path.join('dist', 'apps', '**', '*.entity.js')],
  migrations: [path.join('libs', '**', 'seeds', '*{.js,.ts}')],
};

const dataSource = new DataSource(config);
export default dataSource;

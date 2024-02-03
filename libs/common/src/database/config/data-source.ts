import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './db';

export const config: DataSourceOptions = {
  host: DB_HOST,
  type: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: +DB_PORT,
  database: DB_NAME,
  migrations:
    [
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'apps',
        '**',
        'migrations',
        '**',
        '*{.js,.ts}',
      ),
    ],

};

// export const config: DataSourceOptions = {
//   host: configService.get('DB_HOST'),
//   type: 'mysql',
//   port: configService.get('DB_PORT'),
//   username: configService.get('DB_USERNAME'),
//   password: configService.get('DB_PASSWORD'),
//   database: configService.get('DB_NAME'),
//   autoLoadEntities: true,
//   synchronize: true,
//   migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')],
// };

const dataSource = new DataSource(config);
export default dataSource;

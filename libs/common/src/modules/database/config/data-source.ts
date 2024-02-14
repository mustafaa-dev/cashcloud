import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './database.config';
import { DataSource } from 'typeorm';

export const config: any = {
  host: DB_HOST,
  type: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: +DB_PORT,
  database: DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  synchronize: true,

  // autoLoadEntities: true,
  // cli: {
  //   migrationsDir: 'migrations',
  // },
};

// export const moduleConfig: TypeOrmModuleAsyncOptions = {
//   useFactory: (configService: ConfigService) => ({
//     host: configService.get('DB_HOST'),
//     type: 'mysql',
//     port: configService.get('DB_PORT'),
//     username: configService.get('DB_USERNAME'),
//     password: configService.get('DB_PASSWORD'),
//     database: configService.get('DB_NAME'),
//     // entities: [path.join('src', '**', '*.entity.{ts}')],
//     autoLoadEntities: true,
//     // synchronize: true,
//   }),
//   inject: [ConfigService],
// };
// export const config: DataSourceOptions = {
//   host: 'mysql',
//   type: 'mysql',
//   username: 'root',
//   password: 'toor',
//   port: 3306,
//   database: 'cashcloud',
//   entities: [path.join('src', '**', '*.entity.{ts}')],
//   migrations: [path.join('migrations', '*.ts')],
//   // logging: true,
// };
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

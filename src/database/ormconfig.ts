import { DataSource } from 'typeorm';
import type { Config } from 'src/interfaces/config';
import * as dotenv from 'dotenv';
dotenv.config();

import * as appConfig from 'config';

const { host, username, password, database, schema, port } =
  appConfig.get<Config['database']>('database');

const config: DataSource = new DataSource({
  type: 'postgres',
  host,
  username,
  password,
  database,
  schema,
  port,
  entities: [`${__dirname}/../entities/**/*.entity{.ts,.js}`],
});

export default config;

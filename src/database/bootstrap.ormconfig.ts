import { Client } from 'pg';

import config from './ormconfig';

async function bootstrap() {
  // @ts-ignore
  const { username, password, host, port, schema, database } = config.options;

  let conString = `postgres://${username}:${password}@${host}:${port}/postgres`;
  let client = new Client(conString);
  try {
    await client.connect();
    try {
      const result = await client.query(
        `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${database}');`,
      );
      if (!result?.rows[0].exists) {
        await client.query(`CREATE DATABASE "${database}";`);
      }
    } catch (err) {
      console.error('WARNING: FAILED TO CREATE DATABASE');
    }

    if (schema) {
      conString = `postgres://${username}:${password}@${host}:${port}/${database}`;
      client = new Client(conString);
      await client.connect();
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
    }

    console.log('DB AND SCHEMA BOOTSTRAPED');
    await client.end();
    process.exit(0);
  } catch (e) {
    await client.end();
    console.log('ERROR: FAILED TO BOOTSTRAP DB AND SCHEMA', e);
    process.exit(1);
  }
}

bootstrap();

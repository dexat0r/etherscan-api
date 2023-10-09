import config from './ormconfig';

const migrationConfig = config.setOptions({
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsTableName: '_migrations',
  logger: 'advanced-console',
});

export default migrationConfig;

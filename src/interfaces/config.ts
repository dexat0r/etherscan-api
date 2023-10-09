export interface Config {
  database: {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
    schema: string;
  };
  etherscan: {
    url: string;
    apiKey: string;
  };
  initBlock: number;
}

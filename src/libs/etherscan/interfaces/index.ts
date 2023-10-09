export type GetBlockByNumber = {
  result: {
    number: string;
    transactions: {
      blockNumber: string;
      from: string;
      to: string;
      value: string;
    }[];
  };
};

export type GetLastBlock = {
  result: string;
};

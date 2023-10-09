import { TransactionEntity } from 'src/entities/transaction.entity';

export type GetTransactionsByBlockPeriod = {
  from: number;
  to: number;
  txs: TransactionEntity[];
};

export type GetMostChangedAddressByAbs = {
  from: number;
  to: number;
  mostChangedAddress: string;
  value: string;
};

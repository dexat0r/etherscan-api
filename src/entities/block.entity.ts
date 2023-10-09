import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'blocks' })
export class BlockEntity {
  @PrimaryColumn('integer')
  blockNumber: number;

  @OneToMany(() => TransactionEntity, (tx) => tx.block)
  txs: TransactionEntity[];
}

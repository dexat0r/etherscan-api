import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './block.entity';

@Entity({ name: 'txs' })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  from: string;

  @Column('text', { nullable: true })
  to: string;

  @Column('text', { nullable: true })
  value: string;

  @Column('integer')
  blockNumber: number;

  @ManyToOne(() => BlockEntity)
  @JoinColumn({ name: 'blockNumber', referencedColumnName: 'blockNumber' })
  block: BlockEntity;
}

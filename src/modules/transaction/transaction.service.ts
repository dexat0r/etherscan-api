import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockEntity } from 'src/entities/block.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { LessThan, Repository } from 'typeorm';
import {
  GetMostChangedAddressByAbs,
  GetTransactionsByBlockPeriod,
} from './interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
  ) {}

  public async getMostChangedAddressByAbs(
    period: number,
  ): Promise<GetMostChangedAddressByAbs> {
    const { from, to, txs } = await this.getTransactionsByBlockPeriod(period);
    const addresses = await this.getAddressChanges(txs);
    const mostChangedAddress = this.getMostChangedAddress(addresses);

    return {
      from,
      to,
      mostChangedAddress,
    };
  }

  private async getTransactionsByBlockPeriod(
    period: number,
  ): Promise<GetTransactionsByBlockPeriod> {
    const { blockNumber } = await this.getLastBlock();

    if (!blockNumber) throw new Error('No blocks saved');

    const blocksInPeriod = await this.getBlocksInPeriod(blockNumber, period);

    const txs = blocksInPeriod.reduce<TransactionEntity[]>((arr, block) => {
      arr.concat(block.txs);
      return arr;
    }, []);

    return {
      from: blockNumber - period,
      to: blockNumber,
      txs,
    };
  }

  private async getAddressChanges(txs: TransactionEntity[]) {
    const addresses: Record<string, bigint> = {};

    txs.forEach((tx) => {
      if (!addresses[tx.from]) addresses[tx.from] = BigInt(0);
      if (!addresses[tx.to]) addresses[tx.to] = BigInt(0);

      addresses[tx.from] -= BigInt(parseInt(tx.value, 16));
      addresses[tx.to] += BigInt(parseInt(tx.value, 16));
    });

    return addresses;
  }

  private getMostChangedAddress = (obj: Record<string, bigint>): string => {
    function abs(a: bigint) {
      return a > 0n ? a : -a;
    }

    return Object.keys(obj).reduce((maxKey, key) =>
      abs(obj[key]) > abs(obj[maxKey]) ? key : maxKey,
    );
  };

  private async getLastBlock(): Promise<BlockEntity> {
    return this.blockRepository.findOne({
      where: {},
      order: {
        blockNumber: 'DESC',
      },
    });
  }

  private async getBlocksInPeriod(
    from: number,
    period: number,
  ): Promise<BlockEntity[]> {
    return this.blockRepository.find({
      where: {
        blockNumber: LessThan(from),
      },
      order: {
        blockNumber: 'DESC',
      },
      relations: {
        txs: true,
      },
      take: period,
    });
  }
}

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
    const { mostChangedAddress, value } = this.getMostChangedAddress(addresses);

    return {
      from,
      to,
      mostChangedAddress,
      value: value.toString(),
    };
  }

  private async getTransactionsByBlockPeriod(
    period: number,
  ): Promise<GetTransactionsByBlockPeriod> {
    const lastSavedBlock = await this.getLastBlock();

    if (!lastSavedBlock) throw new Error('No blocks saved');

    const { blockNumber } = lastSavedBlock;

    const [blocksInPeriod, blockAmount] = await this.getBlocksInPeriod(
      blockNumber,
      period,
    );

    if (blockAmount < period) throw new Error('Not enough blocks saved');

    const txs = blocksInPeriod.reduce<TransactionEntity[]>((arr, block) => {
      arr = arr.concat(block.txs);
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

  private getMostChangedAddress = (obj: Record<string, bigint>) => {
    function abs(a: bigint) {
      return a > 0n ? a : -a;
    }

    const mostChangedAddress = Object.keys(obj).reduce((maxKey, key) =>
      abs(obj[key]) > abs(obj[maxKey]) ? key : maxKey,
    );

    return {
      mostChangedAddress,
      value: obj[mostChangedAddress],
    };
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
  ): Promise<[BlockEntity[], number]> {
    return this.blockRepository.findAndCount({
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

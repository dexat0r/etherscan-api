import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import { BlockEntity } from 'src/entities/block.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { Config } from 'src/interfaces/config';
import { EtherscanService } from 'src/libs/etherscan/etherscan.service';
import { MoreThan, Repository } from 'typeorm';
import * as progress from 'cli-progress';
@Injectable()
export class CronService {
  private isInited = false;
  private isLoading = false;
  private initialBlockNumber = config.get<Config['initBlock']>('initBlock');
  private logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly etherscanService: EtherscanService,
  ) {}

  public async init() {
    this.logger.log(`Initing cron service...`);
    const savedBlocks = await this.blockRepository.find({
      where: {
        blockNumber: MoreThan(this.initialBlockNumber),
      },
      order: {
        blockNumber: 'DESC',
      },
    });

    const amountOfBlocksAfterInitial = savedBlocks.length;

    this.logger.log(`Initial block ${this.initialBlockNumber}`);
    this.logger.log(
      `${
        amountOfBlocksAfterInitial
          ? `Last saved block ${savedBlocks[0]?.blockNumber}`
          : `No blocks saved`
      }`,
    );

    const totalAmountOfSavedBlocks =
      this.initialBlockNumber + amountOfBlocksAfterInitial;

    const { result: lastBlock } =
      await this.etherscanService.getLastBlockNumber();

    const parsedLastBlockNumber = parseInt(lastBlock, 16);

    this.logger.log(`Current block ${parsedLastBlockNumber}`);

    const diff = parsedLastBlockNumber - totalAmountOfSavedBlocks;

    this.logger.log(
      `${
        diff > 0
          ? `Blocks to download ${diff}`
          : `Not neccessary to download blocks`
      }`,
    );

    if (diff > 0) {
      this.isLoading = true;
      const { blocks, txs } = await this.downloadBlocksInRange(
        totalAmountOfSavedBlocks,
        diff,
      );

      await this.blockRepository.save(blocks, { chunk: 100 });
      await this.transactionRepository.save(txs, { chunk: 100 });
      this.isLoading = false;
    }

    this.isInited = true;
    this.logger.log(`Cron service inited`);
  }

  @Cron('0 * * * * *')
  public async loadNewBlocks() {
    if (!this.isInited && this.isLoading) {
      return;
    }

    this.logger.log(`Loading new blocks`);

    const lastSavedBlock = await this.blockRepository.findOne({
      where: {},
      order: {
        blockNumber: 'DESC',
      },
    });

    this.logger.log(`Last saved block ${lastSavedBlock.blockNumber}`);

    const { result: lastBlock } =
      await this.etherscanService.getLastBlockNumber();

    const parsedLastBlockNumber = parseInt(lastBlock, 16);

    this.logger.log(`Current block ${parsedLastBlockNumber}`);

    if (parsedLastBlockNumber != lastSavedBlock.blockNumber) {
      this.isLoading = true;
      const diff = parsedLastBlockNumber - lastSavedBlock.blockNumber;

      const { blocks, txs } = await this.downloadBlocksInRange(
        lastSavedBlock.blockNumber,
        diff,
      );

      await this.blockRepository.save(blocks);
      await this.transactionRepository.save(txs);
      this.logger.log(`New blocks loaded`);
      this.isLoading = false;
      return;
    }

    this.logger.log(`No new blocks`)
  }

  private async downloadBlocksInRange(from: number, amount: number) {
    const bar = new progress.SingleBar(
      { clearOnComplete: true },
      progress.Presets.legacy,
    );
    this.logger.log(`Downloading ${amount} blocks from ${from}`);
    bar.start(amount, 0);
    const blocks = [];
    let txs = [];
    for (let i = 1; i < amount + 1; i++) {
      const {
        result: { number, transactions },
      } = await this.etherscanService.getTransactionsByBlockNumber(from + i);

      const tx = transactions.map((tx) =>
        this.transactionRepository.create({
          from: tx.from,
          to: tx.to,
          blockNumber: parseInt(tx.blockNumber, 16),
          value: tx.value,
        }),
      );

      blocks.push(
        this.blockRepository.create({
          blockNumber: parseInt(number, 16),
        }),
      );

      txs = txs.concat(tx);
      bar.update(i);
    }

    bar.stop();

    return {
      blocks,
      txs,
    };
  }
}

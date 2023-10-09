import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { EtherscanModule } from 'src/libs/etherscan/etherscan.module';
import { BlockEntity } from 'src/entities/block.entity';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [TypeOrmModule.forFeature([BlockEntity]), EtherscanModule],
})
export class TransactionModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from 'src/entities/block.entity';
import { EtherscanModule } from 'src/libs/etherscan/etherscan.module';
import { TransactionEntity } from 'src/entities/transaction.entity';

@Module({
  providers: [CronService],
  imports: [
    TypeOrmModule.forFeature([BlockEntity, TransactionEntity]),
    EtherscanModule,
  ],
})
export class CronModule implements OnModuleInit {
  constructor(private readonly cron: CronService) {}
  onModuleInit(): void {
    this.cron.init();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { TransactionModule } from './modules/transaction/transaction.module';
import { CronModule } from './modules/cron/cron.module';

import { AppService } from './app.service';

import dbConfig from './database/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig.options),
    ScheduleModule.forRoot(),
    TransactionModule,
    CronModule,
  ],
  providers: [AppService],
})
export class AppModule {}

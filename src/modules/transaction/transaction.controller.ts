import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('tx')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public getMostChangedAddress(
    @Query('period', new ParseIntPipe({ optional: true })) period: number,
  ) {
    period = period ?? 100;

    return this.transactionService
      .getMostChangedAddressByAbs(period)
      .catch((error) => {
        throw new HttpException(
          error.message ?? 'Server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { description: error.message },
        );
      });
  }
}

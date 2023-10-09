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
    @Query('period', new ParseIntPipe()) period: number,
  ) {
    if (!period)
      throw new HttpException('Invalid period', HttpStatus.BAD_REQUEST);

    try {
      return this.transactionService.getMostChangedAddressByAbs(period);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { description: error.message ?? error },
      );
    }
  }
}

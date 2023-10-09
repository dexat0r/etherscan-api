import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as config from 'config';
import { buildActor } from '../axios-middlewares/build-actor';

const ApiActor = buildActor();

@Injectable()
export class EtherscanService {
  private static readonly transport = axios.create({
    baseURL: config.get('etherscan.url'),
    params: {
      apiKey: config.get('etherscan.apiKey'),
      module: 'proxy',
    },
  });

  @ApiActor()
  public async getTransactionsByBlockNumber(blockNumber: number) {
    return EtherscanService.transport.get('api', {
      params: {
        action: 'eth_getBlockByNumber',
        boolean: 'true',
        tag: blockNumber.toString(16),
      },
    });
  }

  @ApiActor()
  public async getLastBlockNumber() {
    return EtherscanService.transport.get('api', {
      params: {
        action: 'eth_blockNumber',
      },
    });
  }
}

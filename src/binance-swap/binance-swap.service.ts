import { OrderType, Side, Spot } from '@binance/connector-typescript';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BinanceSwapService {
  async executeSwap(quantity: string): Promise<any> {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new HttpException(
        'API Key and Secret are required',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const client = new Spot(apiKey, apiSecret, {
      baseURL: 'https://api.binance.com',
    });

    const accountResponse = await client.accountInformation();
    const balances = accountResponse.balances;
    const wldBalance = balances.find((balance) => balance.asset === 'WLD');
    if (!wldBalance) {
      throw new HttpException('WLD balance not found', HttpStatus.BAD_REQUEST);
    }

    const freeWLD = parseFloat(wldBalance.free);
    console.log('Free WLD balance:', freeWLD);

    if (freeWLD < parseFloat(quantity)) {
      throw new HttpException(
        'Insufficient WLD balance',
        HttpStatus.BAD_REQUEST,
      );
    }

    const symbol = 'WLDUSDT';

    const orderResponse = await client.newOrder(
      symbol,
      Side.SELL,
      OrderType.MARKET,
      {
        quantity: +quantity,
      },
    );

    console.log('Order response:', orderResponse);
    return { success: true, order: orderResponse };
  }
}

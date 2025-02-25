import { Module } from '@nestjs/common';
import { BinanceSwapController } from './binance-swap.controller';

@Module({
  controllers: [BinanceSwapController]
})
export class BinanceSwapModule {}

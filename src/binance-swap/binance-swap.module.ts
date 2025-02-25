import { Module } from '@nestjs/common';
import { BinanceSwapController } from './binance-swap.controller';
import { BinanceSwapService } from './binance-swap.service';

@Module({
  controllers: [BinanceSwapController],
  providers: [BinanceSwapService]
})
export class BinanceSwapModule {}

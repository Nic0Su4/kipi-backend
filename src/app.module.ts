import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BinanceSwapModule } from './binance-swap/binance-swap.module';

@Module({
  imports: [BinanceSwapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

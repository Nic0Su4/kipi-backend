import { Controller, Post, Body } from '@nestjs/common';
import { BinanceSwapService } from './binance-swap.service';

@Controller('binance-swap')
export class BinanceSwapController {
  constructor(private readonly binanceSwapService: BinanceSwapService) {}

  @Post()
  async executeSwap(@Body() body: { quantity: string }): Promise<any> {
    const { quantity } = body;
    if (!quantity) {
      return { success: false, error: 'Quantity is required' };
    }

    return await this.binanceSwapService.executeSwap(quantity);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { BinanceSwapController } from './binance-swap.controller';

describe('BinanceSwapController', () => {
  let controller: BinanceSwapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinanceSwapController],
    }).compile();

    controller = module.get<BinanceSwapController>(BinanceSwapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

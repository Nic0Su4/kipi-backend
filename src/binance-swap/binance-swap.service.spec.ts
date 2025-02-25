import { Test, TestingModule } from '@nestjs/testing';
import { BinanceSwapService } from './binance-swap.service';

describe('BinanceSwapService', () => {
  let service: BinanceSwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceSwapService],
    }).compile();

    service = module.get<BinanceSwapService>(BinanceSwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

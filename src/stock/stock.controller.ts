import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('namesave')
  @HttpCode(200)
  stockNameSave(): string {
    this.stockService.stockNameSave();
    return '주식 목록 저장 성공!';
  }

  @Post('namesavestart')
  @HttpCode(200)
  startStockNameSave(): string {
    this.stockService.startStockNameSave();
    return '스케쥴 시작!';
  }

  @Post('namesavestop')
  @HttpCode(200)
  stopStockNameSave(): string {
    this.stockService.stopStockNameSave();
    return '스케쥴 종료!';
  }

  @Post('pricesave')
  @HttpCode(200)
  stockPriceSave(): string {
    this.stockService.stockPriceSave();
    return '주식 가격 저장 성공!';
  }

  @Post('pricesavestart')
  @HttpCode(200)
  startStockPriceSave(): string {
    this.stockService.startStockPriceSave();
    return '스케쥴 시작!';
  }

  @Post('pricesavestop')
  @HttpCode(200)
  stopStockPriceSave(): string {
    this.stockService.stopStockPriceSave();
    return '스케쥴 종료!';
  }

  @Get('prices')
  async getStockPrices() {
    return this.stockService.getStockPrices();
  }
}

import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('fetchAndSave')
  @HttpCode(200)
  fetchAndSaveData(): string {
    this.stockService.fetchDataAndSaveToDB();
    return '데이터 저장 성공!';
  }

  @Get('prices')
  async getStockPrices() {
    return this.stockService.getStockPrices();
  }

  @Post('token')
  async tokenCreate() {
    return this.stockService.tokenCreate();
  }
}

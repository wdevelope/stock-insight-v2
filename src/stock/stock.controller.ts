import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('stock')
@Controller('api/stocks')
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
    return '주식 목록 스케쥴 시작!';
  }

  @Post('namesavestop')
  @HttpCode(200)
  stopStockNameSave(): string {
    this.stockService.stopStockNameSave();
    return '주식 목록 스케쥴 종료!';
  }

  @Post('pricesave')
  @HttpCode(200)
  stockPriceSave(): string {
    this.stockService.stockPriceSave();
    return '주식 가격 저장 성공!';
  }

  @Post('indexsave')
  @HttpCode(200)
  stockIndexSave(): string {
    this.stockService.stockIndexSave();
    return '주가 지수 저장 성공!';
  }

  @Post('pricesavestart')
  @HttpCode(200)
  startStockPriceSave(): string {
    this.stockService.startStockPriceSave();
    return '주식 가격 스케쥴 시작!';
  }

  @ApiOperation({ summary: '' })
  @Post('pricesavestop')
  @HttpCode(200)
  stopStockPriceSave(): string {
    this.stockService.stopStockPriceSave();
    return '주식 가격 스케쥴 종료!';
  }

  @ApiOperation({ summary: '' })
  @Get('price/:id')
  async getStockPrice(@Param('id') id: string): Promise<any> {
    return this.stockService.getStockPrice(id);
  }
  @Get('index')
  async getStockindex(): Promise<any> {
    return this.stockService.getStockindex();
  }

  //http://localhost:3000/api/stocks/(?page=1)
  @ApiOperation({ summary: '' })
  @Get('/')
  async getStockPage(@Query('page') page: number = 1): Promise<any> {
    return await this.stockService.getStockPage(page);
  }
  //http://localhost:3000/api/stocks/quiz
  @ApiOperation({ summary: '' })
  @Get('/quiz')
  async getStockQuiz(): Promise<any> {
    return await this.stockService.getStockQuiz();
  }
  //http://localhost:3000/api/stocks/rank/
  @ApiOperation({ summary: '' })
  @Get('/rank')
  async getStockRank(): Promise<any> {
    return await this.stockService.getStockRank();
  }
  //http://localhost:3000/api/stocks/search/(?query=검색어)
  @ApiOperation({ summary: '' })
  @Get('search')
  async searchStock(@Query('query') query: string): Promise<any> {
    return await this.stockService.searchStock(query);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '' })
  @UseGuards(JwtAuthGuard)
  @Post('mystock/:stockId')
  addMyStock(
    @CurrentUser() user: Users,
    @Param('stockId') stockId: string,
  ): Promise<void> {
    return this.stockService.addMyStock(user, stockId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '' })
  @UseGuards(JwtAuthGuard)
  @Delete('mystock/:stockId')
  deleteMyStock(
    @CurrentUser() user: Users,
    @Param('stockId') stockId: string,
  ): Promise<void> {
    return this.stockService.deleteMyStock(user, stockId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '' })
  @UseGuards(JwtAuthGuard)
  @Get('mystock')
  getMyStock(@CurrentUser() user: Users): Promise<any> {
    return this.stockService.getMyStock(user);
  }
}

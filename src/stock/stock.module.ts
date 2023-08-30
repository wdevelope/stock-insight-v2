import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Stock } from './entities/stock.entity';
import { StockPrice } from './entities/stockPrice.entity';
import { JwtModule } from '@nestjs/jwt';
import { MyStock } from './entities/myStock.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Stock, StockPrice, MyStock]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

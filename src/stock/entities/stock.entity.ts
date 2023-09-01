import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockPrice } from './stockPrice.entity';
import { MyStock } from './myStock.entity';
import { Quiz } from 'src/quiz/quiz.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Stock {
  @ApiProperty({ description: '스톡 아이디' })
  @PrimaryColumn({ unique: true })
  id: string; // 코드명

  @ApiProperty({ description: '이름' })
  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @ApiProperty({ description: '시장 이름' })
  @Column()
  rprs_mrkt_kor_name: string; // 대표 시장명

  @ApiProperty({ description: '업데이트 날짜' })
  @Column()
  updated_day: string; //업데이트 날짜

  @ApiProperty({ description: '주식 생성 시간' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '주식 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.stock, {
    cascade: true,
  })
  stockPrices: StockPrice[];

  @OneToMany(() => MyStock, (myStock) => myStock.stock, { cascade: true })
  myStocks: MyStock[];

  @OneToMany(() => Quiz, (quiz) => quiz.user, { eager: true })
  quiz: Quiz[];
}

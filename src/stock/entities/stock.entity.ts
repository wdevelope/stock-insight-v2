import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockPrice } from './stockPrice.entity';

@Entity()
export class Stock {
  @PrimaryColumn({ unique: true })
  id: string; // 코드명

  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @Column()
  rprs_mrkt_kor_name: string; // 대표 시장명

  @Column()
  updated_day: string; //업데이트 날짜

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.stock, {
    cascade: true,
  })
  stockPrices: StockPrice[];
}

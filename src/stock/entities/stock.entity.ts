import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { StockPrice } from './stockPrice.entity';

@Entity()
export class Stock {
  @PrimaryColumn()
  id: string; // 코드명

  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @Column()
  rprs_mrkt_kor_name: string; // 대표 시장명

  @Column()
  bstp_kor_isnm: string; // 업종명

  @Column()
  iscd_stat_cls_code: string; //종목 상태 구분 코드
  //00(그외),51(관리종목),52(투자의견),53(투자경고),54(투자주의),55(신용가능),57(증거금 100%),58(거래정지),59(단기과열)

  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.stock)
  stockPrices: StockPrice[];
}

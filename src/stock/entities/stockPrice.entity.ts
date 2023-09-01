import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stock } from './stock.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StockPrice {
  @ApiProperty({ description: '스톡 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  stck_prpr: string; //주식 현재가

  @ApiProperty()
  @Column()
  prdy_vrss: string; // 전일 대비

  @ApiProperty()
  @Column()
  prdy_vrss_sign: string; // 전일 대비 부호
  //1(상한),2(상승),3(보합),4(하한),5(하락)

  @ApiProperty()
  @Column()
  prdy_ctrt: string; // 전일 대비율

  @ApiProperty()
  @Column()
  stck_oprc: string; //당일 시가

  @ApiProperty()
  @Column()
  stck_hgpr: string; //당일 고가

  @ApiProperty()
  @Column()
  stck_lwpr: string; //당일 저가

  @ApiProperty()
  @Column()
  stck_sdpr: string; //전일 종가

  @ApiProperty()
  @Column()
  acml_vol: string; //누적 거래량

  @ApiProperty()
  @Column()
  acml_tr_pbmn: string; //누적 거래대금

  @ApiProperty()
  @Column()
  hts_frgn_ehrt: string; //외국인 소진율

  @ApiProperty()
  @Column()
  hts_avls: string; // 시가총액

  @ApiProperty()
  @Column()
  per: string; // PER(주가수익비율)

  @ApiProperty()
  @Column()
  pbr: string; // PBR(주가순자산비율)

  @ApiProperty()
  @Column()
  w52_hgpr: string; // 52주 최고가

  @ApiProperty()
  @Column()
  w52_lwpr: string; // 52주 최저가

  @ApiProperty()
  @Column()
  whol_loan_rmnd_rate: string; // 융자 잔고 비율

  @ApiProperty()
  @Column()
  bstp_kor_isnm: string; // 업종명

  @ApiProperty()
  @Column()
  iscd_stat_cls_code: string; //종목 상태 구분 코드
  //00(그외),51(관리종목),52(투자의견),53(투자경고),54(투자주의),55(신용가능),57(증거금 100%),58(거래정지),59(단기과열)

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Stock, (stock) => stock.stockPrices, { onDelete: 'CASCADE' })
  stock: Stock;
}

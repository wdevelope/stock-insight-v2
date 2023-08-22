import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stck_shrn_iscd: string; // 코드명

  @Column()
  bstp_kor_isnm: string; // 업종명

  @Column()
  stck_oprc: string; //현재 시가

  @Column()
  stck_hgpr: string; //주식 최고가

  @Column()
  stck_lwpr: string; //주식 최저가

  @Column()
  acml_vol: string; //누적 거래량

  @Column()
  stck_prpr: string; //주식 현재가

  @Column()
  acml_tr_pbmn: string; //누적 거래대금

  @Column()
  prdy_vrss: string; // 전일 대비

  @Column()
  hts_avls: string; // 시가총액

  @Column()
  iscd_stat_cls_code: string; //종목 상태 구분 코드

  @Column()
  prdy_ctrt: string; // 종가대비 등락률

  @Column()
  prdy_vrss_sign: string; // 전일 대비 부호 1(상한), 2(상승), 3(보합), 4(하한), 5(하락)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

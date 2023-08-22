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
  rprs_mrkt_kor_name: string; // 대표 시장명

  @Column()
  bstp_kor_isnm: string; // 업종명

  @Column()
  stck_prpr: string; //주식 현재가

  @Column()
  prdy_vrss: string; // 전일 대비

  @Column()
  prdy_vrss_sign: string; // 전일 대비 부호
  //1(상한),2(상승),3(보합),4(하한),5(하락)

  @Column()
  prdy_ctrt: string; // 전일 대비율

  @Column()
  stck_oprc: string; //당일 시가

  @Column()
  stck_hgpr: string; //당일 고가

  @Column()
  stck_lwpr: string; //당일 저가

  @Column()
  stck_sdpr: string; //전일 종가

  @Column()
  acml_vol: string; //누적 거래량

  @Column()
  acml_tr_pbmn: string; //누적 거래대금

  @Column()
  hts_frgn_ehrt: string; //외국인 소진율

  @Column()
  hts_avls: string; // 시가총액

  @Column()
  per: string; // PER(주가수익비율)

  @Column()
  pbr: string; // PBR(주가순자산비율)

  @Column()
  w52_hgpr: string; // 52주 최고가

  @Column()
  w52_lwpr: string; // 52주 최저가

  @Column()
  whol_loan_rmnd_rate: string; // 융자 잔고 비율

  @Column()
  iscd_stat_cls_code: string; //종목 상태 구분 코드
  //00(그외),51(관리종목),52(투자의견),53(투자경고),54(투자주의),55(신용가능),57(증거금 100%),58(거래정지),59(단기과열)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StockIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bstp_cls_code: string; // 지수 코드 0001(코스피), 1001(코스닥)

  @Column()
  bstp_nmix_prpr: string; //지수 현재가

  @Column()
  bstp_nmix_prdy_vrss: string; // 전일 대비

  @Column()
  bstp_nmix_prdy_ctrt: string; // 전일 대비율

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Users } from 'src/users/users.entity';
import { Stock } from '../stock/entities/stock.entity';
import { CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // upANDdown
  upANDdown: string;

  @Column() // 주식이름
  stockName: string;

  @Column()
  answer: boolean;

  @Column({ default: 1 })
  count: number;

  @Column()
  updated_date: string; //업데이트 날짜

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.quiz)
  @JoinColumn({ name: 'stockId', referencedColumnName: 'id' })
  stock: Stock;

  @Column()
  stockId: string;
}

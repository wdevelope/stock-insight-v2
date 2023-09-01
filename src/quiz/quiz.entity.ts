import { Users } from 'src/users/users.entity';
import { Stock } from '../stock/entities/stock.entity';
import { QuizCount } from './quizCount.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.id)
  stock: Stock;

  @ManyToOne(() => QuizCount, (quizCount) => quizCount)
  quizCount: QuizCount;
}

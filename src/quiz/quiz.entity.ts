import { Users } from 'src/users/users.entity';
import { Stock } from '../stock/entities/stock.entity';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // upANDdown
  upANDdown: string;

  @Column({ default: null })
  correct: string;

  @Column()
  updated_date: string; //업데이트 날짜

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.quiz)
  @JoinColumn({ name: 'stockId', referencedColumnName: 'id' })
  stock: Stock;

  @Column()
  stockId: string;

  @Column({ default: false })
  is_checked: boolean;
}

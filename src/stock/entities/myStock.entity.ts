import { Users } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
export class MyStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.myStocks)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.myStocks, { nullable: false })
  stock: Stock;
}

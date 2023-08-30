import { Users } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
export class MyStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string; // 코드명

  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @ManyToOne(() => Users, (user) => user.myStocks)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.myStocks, { nullable: false })
  stock: Stock;
}

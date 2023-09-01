import { Users } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class MyStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stockId: string; // 코드명

  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @ManyToOne(() => Users, (user) => user.myStocks)
  user: Users;
}

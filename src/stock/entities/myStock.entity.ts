import { Users } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Stock } from './stock.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MyStock {
  @ApiProperty({ description: '스톡 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '코드' })
  @Column()
  code: string; // 코드명

  @ApiProperty({ description: '이름' })
  @Column()
  prdt_abrv_name: string; // 주식 한글명

  @ManyToOne(() => Users, (user) => user.myStocks)
  user: Users;

  @ManyToOne(() => Stock, (stock) => stock.myStocks, { nullable: false })
  stock: Stock;
}

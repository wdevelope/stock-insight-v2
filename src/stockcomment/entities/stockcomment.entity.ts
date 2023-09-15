import { ApiProperty } from '@nestjs/swagger';
import { Stock } from 'src/stock/entities/stock.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StockComment {
  @ApiProperty({ description: '댓글 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '댓글 내용' })
  @Column()
  comment: string;

  @ApiProperty({ description: '댓글 생성 시간' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '댓글 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Stock, (stock) => stock.stockComment, {
    onDelete: 'CASCADE',
  })
  stock: Stock;

  @ManyToOne(() => Users, (user) => user.stockComment, { onDelete: 'CASCADE' })
  user: Users;
}

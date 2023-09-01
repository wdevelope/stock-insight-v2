import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Askboard } from './askboard.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Reply {
  @ApiProperty({ description: '리플레이 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '타이틀' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Askboard, (askboard) => askboard.replies)
  askboard: Askboard;

  @ManyToOne(() => Users, (user) => user.askboard)
  user: Users;
}

import { Users } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reply } from './reply.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Askboard {
  @ApiProperty({ description: '문의 게시판 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '타이틀' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column()
  description: string;

  @ApiProperty({ description: '답글 유무' })
  has_reply?: number;

  @ApiProperty({ description: '문의 게시판 생성 시간' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '문의 게시판 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @ManyToOne(() => Users, (user) => user.askboard)
  user: Users;

  @OneToMany(() => Reply, (reply) => reply.askboard)
  replies: Reply[];
}

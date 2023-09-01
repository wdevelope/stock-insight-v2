import { ApiProperty } from '@nestjs/swagger';
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
export class NoticeBoard {
  @ApiProperty({ description: '공지 게시판 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '타이틀' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column()
  description: string;

  @ApiProperty({ description: '이미지' })
  @Column()
  image: string;

  @ApiProperty({ description: '공지 게시판 생성 시간' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '공지 게시판 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.noticeboard)
  user: Users;
}

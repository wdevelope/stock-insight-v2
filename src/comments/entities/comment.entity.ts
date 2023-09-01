import { ApiProperty } from '@nestjs/swagger';
import { Board } from 'src/boards/entities/board.entity';
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
export class Comment {
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

  @ManyToOne(() => Board, (board) => board.comment, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => Users, (user) => user.comment, { onDelete: 'CASCADE' })
  user: Users;
}

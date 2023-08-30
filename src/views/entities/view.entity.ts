import { Board } from 'src/boards/entities/board.entity';
import { Users } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Views {
  @ApiProperty({ description: '조회수 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '조회수 생성 시간' })
  @CreateDateColumn()
  created_at: Date;
  @ApiProperty({ description: '조회수 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.views, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Board, (board) => board.views, { onDelete: 'CASCADE' })
  board: Board;
}

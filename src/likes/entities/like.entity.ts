import { Board } from 'src/boards/entities/board.entity';
import { Users } from 'src/users/users.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Likes {
  @ApiProperty({ description: '좋아요 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.likes, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Board, (board) => board.likes, { onDelete: 'CASCADE' })
  board: Board;
}

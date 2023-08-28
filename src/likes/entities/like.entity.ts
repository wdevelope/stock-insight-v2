import { Board } from 'src/boards/entities/board.entity';
import { Users } from 'src/users/users.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.likes, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Board, (board) => board.likes, { onDelete: 'CASCADE' })
  board: Board;
}

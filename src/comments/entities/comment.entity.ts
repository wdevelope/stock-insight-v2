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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Board, (board) => board.comment, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => Users, (user) => user.comment, { onDelete: 'CASCADE' })
  user: Users;
}

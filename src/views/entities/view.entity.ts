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
export class Views {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.views, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Board, (board) => board.views, { onDelete: 'CASCADE' })
  board: Board;
}

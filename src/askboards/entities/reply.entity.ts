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

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

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

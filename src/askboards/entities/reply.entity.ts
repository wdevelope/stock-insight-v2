import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Askboard } from './askboard.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Askboard, (askboard) => askboard.replies)
  askboard: Askboard;
}

import { Comment } from 'src/comments/entities/comment.entity';
import { Likes } from 'src/likes/entities/like.entity';
import { Users } from 'src/users/users.entity';
import { Views } from 'src/views/entities/view.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  join?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.board)
  user: Users;

  @OneToMany(() => Comment, (comment) => comment.board, {
    // cascade: true,
    eager: true,
  })
  comment: Comment[];

  @OneToMany(() => Likes, (likes) => likes.board, {
    eager: true,
    cascade: true,
  })
  likes: Likes[];

  @OneToMany(() => Views, (views) => views.board, {
    cascade: true,
    eager: true,
  })
  views: Views;
}

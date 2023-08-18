import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Likes } from 'src/likes/entities/like.entity';
import { OneToMany } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  imgUrl: string;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  board: Board[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: true })
  comment: Comment[];

  @OneToMany(() => Likes, (likes) => likes.user, { cascade: true, eager: true })
  likes: Likes[];
}

import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Likes } from 'src/likes/entities/like.entity';
import { NoticeBoard } from 'src/noticeboards/entities/noticeboard.entity';
import { Askboard } from 'src/askboards/entities/askboard.entity';
import { Views } from 'src/views/entities/view.entity';
import { Quiz } from 'src/quiz/quiz.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MyStock } from 'src/stock/entities/myStock.entity';

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

  @Column({ nullable: true })
  thirdPartyId?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({ default: 'user' })
  status: string;

  @Column({ default: 100 })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  board: Board[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: true })
  comment: Comment[];

  @OneToMany(() => Likes, (likes) => likes.user, { cascade: true, eager: true })
  likes: Likes[];

  @OneToMany(() => Views, (views) => views.user, { cascade: true, eager: true })
  views: Views[];

  @OneToMany(() => NoticeBoard, (noticeboard) => noticeboard.user, {
    cascade: true,
    eager: true,
  })
  noticeboard: NoticeBoard;

  @OneToMany(() => Quiz, (quiz) => quiz.user, { eager: true })
  quiz: Quiz[];

  @OneToMany(() => Askboard, (askboard) => askboard.user, {
    cascade: true,
    eager: true,
  })
  askboard: Askboard;

  @OneToMany(() => MyStock, (myStock) => myStock.user, {
    cascade: true,
    eager: true,
  })
  myStocks: MyStock[];
}

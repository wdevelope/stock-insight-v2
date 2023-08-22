import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Likes } from 'src/likes/entities/like.entity';
import { NoticeBoard } from 'src/noticeboards/entities/noticeboard.entity';
import { Views } from 'src/views/entities/view.entity';
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

  @Column({ nullable: true })
  thirdPartyId?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({ default: 'user' })
  status: string;

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
}

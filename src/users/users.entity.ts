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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Users {
  @ApiProperty({ description: '유저 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일' })
  @Column()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @Column()
  password: string;

  @ApiProperty({ description: '닉네임' })
  @Column()
  nickname: string;

  @ApiProperty({ description: '이미지' })
  @Column({ nullable: true })
  imgUrl: string;

  @ApiProperty({ description: '파티아이디?' })
  @Column({ nullable: true })
  thirdPartyId?: string;

  @ApiProperty({ description: '프로바이더?' })
  @Column({ nullable: true })
  provider?: string;

  @ApiProperty({ description: '스테이터스' })
  @Column({ default: 'user' })
  status: string;

  @ApiProperty({ description: '포인트' })
  @Column({ default: 100 })
  point: number;

  @ApiProperty({ description: '유저 생성 시간' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '유저 수정 시간' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '유저 삭제 시간' })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Board, (board) => board.user)
  board: Board[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Likes, (likes) => likes.user, { cascade: true })
  likes: Likes[];

  @OneToMany(() => Views, (views) => views.user, { cascade: true })
  views: Views[];

  @OneToMany(() => NoticeBoard, (noticeboard) => noticeboard.user, {
    cascade: true,
  })
  noticeboard: NoticeBoard;

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quiz: Quiz[];

  @OneToMany(() => Askboard, (askboard) => askboard.user, { cascade: true })
  askboard: Askboard;

  @OneToMany(() => MyStock, (myStock) => myStock.user, { cascade: true })
  myStocks: MyStock[];
}

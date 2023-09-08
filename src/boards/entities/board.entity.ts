import { Comment } from 'src/comments/entities/comment.entity';
import { Likes } from 'src/likes/entities/like.entity';
import { Users } from 'src/users/users.entity';
import { Views } from 'src/views/entities/view.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '게시물 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '게시물 타이틀' })
  @Column()
  title: string;

  @ApiProperty({ description: '게시물 내용' })
  @Column()
  description: string;

  @ApiProperty({ description: '게시물 이미지' })
  @Column()
  image: string;

  @ApiProperty({ description: '게시물 좋아요 수' })
  @Column({ default: 0 })
  likeCount: number;

  @ApiProperty({ description: '게시물 조회수' })
  @Column({ default: 0 })
  viewCount: number;

  @ApiProperty({ description: '게시물 생성 시간' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '게시물 수정 시간' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: '인덱싱 체크' })
  @Column({ default: false })
  is_checked: boolean;

  @ManyToOne(() => Users, (user) => user.board)
  user: Users;

  @OneToMany(() => Comment, (comment) => comment.board, {
    cascade: true,
  })
  comment: Comment[];

  @OneToMany(() => Likes, (likes) => likes.board, {
    cascade: true,
  })
  likes: Likes[];

  @OneToMany(() => Views, (views) => views.board, {
    cascade: true,
  })
  views: Views[];
}

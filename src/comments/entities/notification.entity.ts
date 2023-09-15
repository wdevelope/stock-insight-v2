import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Board } from 'src/boards/entities/board.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.notification)
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  board: Board;

  @Column()
  boardId: number;

  @ManyToOne(() => Users, (user) => user.notification)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Users;

  @Column()
  userId: number;

  @OneToOne(() => Comment, (comment) => comment.notification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
  comment: Comment;

  @Column()
  commentId: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ['new_comment', 'like'] })
  notificationType: 'new_comment' | 'like';

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Users } from 'src/users/users.entity';
import { CommentsRepository } from './comments.repository';
import { CommentDto } from './dto/comment.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
  ) {}

  async create(
    user: Users,
    commentDto: CommentDto,
    board: Board,
  ): Promise<any> {
    const boardId = Number(board);
    const currentBoard = await this.boardsRepository
      .createQueryBuilder('b')
      .where('b.id = :id', { id: boardId })
      .innerJoin('b.user', 'user')
      .addSelect('user.id')
      .getRawOne();

    if (!currentBoard) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }

    // 1. 코멘트 저장
    const savedComment = await this.commentsRepository.save(
      user,
      commentDto,
      board,
    );
    console.log('현재 코멘트 쓰는 userid', user.id);

    console.log('보드주인의 userid', currentBoard.user_id);

    if (user.id !== currentBoard.user_id) {
      // 2. 알림 생성
      const notificationMessage = `${user.nickname}님이 코멘트를 작성 [내용] ${savedComment.comment}`;
      const notification = new Notification();
      notification.message = notificationMessage;
      notification.boardId = boardId; // 현재 보드의 ID
      notification.userId = currentBoard.user_id; // 보드의 사용자 ID로 알림 대상 지정
      notification.commentId = savedComment.id; // 알림과 코멘트 연결

      const result = await this.notificationRepository.save(notification);
      return result;
    }
  }

  async findAllByBoard(boardId: number): Promise<Comment[]> {
    const board = await this.commentsRepository.findBoard(boardId);
    if (!board) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    try {
      const comment =
        await this.commentsRepository.findWithUserNickname(boardId);
      return comment;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async update(
    user: Users,
    boardId: number,
    commentId: number,
    commentDto: CommentDto,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId }, user: { id: user.id } },
    });
    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    try {
      await this.commentsRepository.update(commentDto, commentId);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async remove(user: Users, boardId: number, commentId: number): Promise<void> {
    const existedcomment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId }, user: { id: user.id } },
    });

    if (!existedcomment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    await this.commentsRepository.remove(existedcomment);
  }

  // 알림 읽음 표시
  async updateNotification(id: number): Promise<any> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('id=:id', { id: id })
      .execute();
  }

  // 알림 삭제
  async removeNotification(id: number): Promise<void> {
    const existedNotification = await this.notificationRepository.findOne({
      where: { id: id },
    });

    if (!existedNotification) {
      throw new NotFoundException('알림이 존재하지 않습니다.');
    }

    await this.commentsRepository.remove(existedNotification);
  }
}

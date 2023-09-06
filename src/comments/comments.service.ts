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

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async create(
    user: Users,
    commentDto: CommentDto,
    board: Board,
  ): Promise<void> {
    const existedBoard = await this.commentsRepository.findBoard(board.id);
    if (!existedBoard) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    await this.commentsRepository.save(user, commentDto, board);
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
}

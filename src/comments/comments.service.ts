import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Board } from 'src/boards/entities/board.entity';
import { Users } from 'src/users/users.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    user: Users,
    createCommentDto: CreateCommentDto,
    boardId: Board,
  ): Promise<void> {
    await this.commentsRepository.save({
      comment: createCommentDto.comment,
      board: boardId,
      user: user,
    });
  }

  async findAllByBoard(boardId: number): Promise<Comment[]> {
    const comment = await this.commentsRepository.findOne({
      where: { board: { id: boardId } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return this.commentsRepository.find({ where: { board: { id: boardId } } });
  }

  async update(
    user: Users,
    boardId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId }, user: { id: user.id } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        comment: updateCommentDto.comment,
      })
      .where('id=:id', { id: commentId })
      .execute();
  }

  async remove(user: Users, boardId: number, commentId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId }, user: { id: user.id } },
    });

    if (!comment) {
      throw new NotFoundException();
    }

    await this.commentsRepository.remove(comment);
  }
}

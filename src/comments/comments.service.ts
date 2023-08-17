import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Board } from 'src/boards/entities/board.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    boardId: Board,
  ): Promise<void> {
    await this.commentsRepository.save({
      comment: createCommentDto.comment,
      board: boardId,
    });
  }

  async findAllByBoard(boardId: number): Promise<Comment[]> {
    return this.commentsRepository.find({ where: { board: { id: boardId } } });
  }

  async update(
    boardId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        comment: updateCommentDto.comment,
      })
      .where('id=:id', { id: commentId })
      .execute();
  }

  async remove(boardId: number, commentId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, board: { id: boardId } },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentsRepository.remove(comment);
  }
}

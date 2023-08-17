import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Board } from 'src/boards/entities/board.entity';
import { Comment } from './entities/comment.entity';

@Controller('boards')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/:boardId')
  create(
    @Param('boardId') boardId: Board,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(createCommentDto, boardId);
  }

  @Get('/:boardId')
  findAllByBoard(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentsService.findAllByBoard(boardId);
  }

  @Patch('/:boardId/comments/:commentId')
  update(
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(boardId, commentId, updateCommentDto);
  }

  @Delete('/:boardId/comments/:commentId')
  remove(
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentsService.remove(boardId, commentId);
  }
}

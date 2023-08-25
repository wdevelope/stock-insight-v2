import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Board } from 'src/boards/entities/board.entity';
import { Comment } from './entities/comment.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { CommentDto } from './dto/comment.dto';
@UseGuards(JwtAuthGuard)
@Controller('api/boards')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/:boardId/comments')
  create(
    @CurrentUser() user: Users,
    @Param('boardId') board: Board,
    @Body(ValidationPipe) commentDto: CommentDto,
  ) {
    try {
      return this.commentsService.create(user, commentDto, board);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Get('/:boardId/comments')
  findAllByBoard(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentsService.findAllByBoard(boardId);
  }

  @Patch('/:boardId/comments/:commentId')
  update(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
    @Body(ValidationPipe) commentDto: CommentDto,
  ) {
    try {
      return this.commentsService.update(user, boardId, commentId, commentDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Delete('/:boardId/comments/:commentId')
  remove(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
  ) {
    try {
      return this.commentsService.remove(user, boardId, commentId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('comments')
@Controller('api/boards')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/:boardId/comments')
  @ApiOperation({
    summary: '댓글 생성 API.',
    description: '댓글을 생성한다.',
  })
  @ApiBody({ type: [CommentDto] })
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
  @ApiOperation({
    summary: '댓글 조회(boardId) API.',
    description: '댓글을 조회(boardId) 한다.',
  })
  findAllByBoard(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentsService.findAllByBoard(boardId);
  }

  @Patch('/:boardId/comments/:commentId')
  @ApiOperation({
    summary: '댓글 수정 API.',
    description: '댓글을 수정한다.',
  })
  @ApiBody({ type: [CommentDto] })
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
  @ApiOperation({
    summary: '댓글 삭제 API.',
    description: '댓글을 삭제한다.',
  })
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

  // 알림 읽기 http://localhost:3000/api/boards/notification/:id
  @Patch('/notification/:id')
  async updateNotification(@Param('id') id: number) {
    return await this.commentsService.updateNotification(id);
  }

  // 알림 삭제 http://localhost:3000/api/boards/notification/:id
  @Delete('/notification/:id')
  async removeNotification(@Param('id') id: number) {
    return await this.commentsService.removeNotification(id);
  }
}

import { Controller, Param, Post, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:boardId')
  createOrDelete(
    @CurrentUser() user: Users,
    @Param('boardId') board: number,
  ): Promise<void> {
    return this.likesService.createOrDelete(user, board);
  }

  @Get('/:boardId')
  likeTotalCnt(@Param('boardId') board: number): Promise<number> {
    return this.likesService.likeTotalCnt(board);
  }
}

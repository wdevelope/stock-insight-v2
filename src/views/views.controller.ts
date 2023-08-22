import { Controller, Param, Post, Get, UseGuards } from '@nestjs/common';
import { ViewsService } from './views.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
@UseGuards(JwtAuthGuard)
@Controller('api/views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}
  @UseGuards(ThrottlerGuard)
  @Post('/:boardId')
  createOrAdd(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
  ): Promise<void> {
    return this.viewsService.createOrAdd(user, boardId);
  }

  @Get('/:boardId')
  likeTotalCnt(@Param('boardId') boardId: number): Promise<number> {
    return this.viewsService.viewTotalCnt(boardId);
  }
}

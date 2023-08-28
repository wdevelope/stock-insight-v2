import {
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
    try {
      return this.viewsService.createOrAdd(user, boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Get('/:boardId')
  likeTotalCnt(@Param('boardId') boardId: number): Promise<number> {
    try {
      return this.viewsService.viewTotalCnt(boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

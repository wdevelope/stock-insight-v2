import {
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('views')
@Controller('api/views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}
  @UseGuards(ThrottlerGuard)
  @Post('/:boardId')
  @ApiOperation({
    summary: '조회수 생성 API.',
    description: '조회수를 생성한다.',
  })
  createOrAdd(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    try {
      return this.viewsService.createOrAdd(user, boardId, updateBoardDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Get('/:boardId')
  @ApiOperation({
    summary: '조회수 조회 API.',
    description: '조회수를 조회한다.',
  })
  likeTotalCnt(@Param('boardId') boardId: number): Promise<number> {
    try {
      return this.viewsService.viewTotalCnt(boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

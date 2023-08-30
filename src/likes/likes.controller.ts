import {
  Controller,
  Param,
  Post,
  Get,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('likes')
@Controller('api/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:boardId')
  @ApiOperation({
    summary: '좋아요 생성 API.',
    description: '좋아요를 생성한다.',
  })
  @ApiBody({ type: [UpdateBoardDto] })
  createOrDelete(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    try {
      return this.likesService.createOrDelete(user, boardId, updateBoardDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Get('/:boardId')
  @ApiOperation({
    summary: '좋아요 조회 API.',
    description: '좋아요를 조회한다.',
  })
  likeTotalCnt(@Param('boardId') board: number): Promise<number> {
    try {
      return this.likesService.likeTotalCnt(board);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

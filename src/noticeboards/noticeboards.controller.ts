import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { NoticeboardsService } from './noticeboards.service';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { NoticeBoard } from './entities/noticeboard.entity';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('noticeboards')
@ApiBearerAuth('JWT-auth')
@Controller('api/noticeboards')
export class NoticeboardsController {
  constructor(private readonly noticeboardsService: NoticeboardsService) {}

  @ApiOperation({
    summary: '공지 게시판 생성 API',
    description: '공지 게시판을 생성한다.',
  })
  @ApiBody({ type: CreateNoticeboardDto })
  @Post()
  create(
    @Body(ValidationPipe) createNoticeBoardDto: CreateNoticeboardDto,
    @CurrentUser() user: Users,
  ): Promise<void> {
    try {
      return this.noticeboardsService.create(createNoticeBoardDto, user);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @ApiOperation({
    summary: '공지 게시판 조회 API',
    description: '공지 게시판을 조회한다.',
  })
  @Get()
  findAll(): Promise<NoticeBoard[]> {
    try {
      return this.noticeboardsService.find();
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @ApiOperation({
    summary: '공지 게시판 상세 조회 API',
    description: '공지 게시판을 상세 조회한다.',
  })
  @Get('/:noticeBoardId')
  findOne(@Param('noticeBoardId') noticeBoardId: number): Promise<NoticeBoard> {
    try {
      return this.noticeboardsService.findOne(noticeBoardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @ApiOperation({
    summary: '공지 게시판 수정 API',
    description: '공지 게시판을 수정한다.',
  })
  @ApiBody({ type: UpdateBoardDto })
  @Patch('/:noticeBoardId')
  update(
    @CurrentUser() user: Users,
    @Param('noticeBoardId') noticeBoardId: number,
    @Body() updateNoticeBoardDto: UpdateBoardDto,
  ): Promise<void> {
    try {
      return this.noticeboardsService.update(
        user,
        noticeBoardId,
        updateNoticeBoardDto,
      );
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @ApiOperation({
    summary: '공지 게시판 삭제 API',
    description: '공지 게시판을 삭제한다.',
  })
  @Delete('/:noticeBoardId')
  remove(
    @CurrentUser() user: Users,
    @Param('noticeBoardId') noticeBoardId: number,
  ): Promise<void> {
    try {
      return this.noticeboardsService.remove(user, noticeBoardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

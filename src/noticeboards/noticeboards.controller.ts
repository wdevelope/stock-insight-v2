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

@UseGuards(JwtAuthGuard)
@Controller('api/noticeboards')
export class NoticeboardsController {
  constructor(private readonly noticeboardsService: NoticeboardsService) {}

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

  @Get()
  findAll(): Promise<NoticeBoard[]> {
    try {
      return this.noticeboardsService.find();
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Get('/:noticeBoardId')
  findOne(@Param('noticeBoardId') noticeBoardId: number): Promise<NoticeBoard> {
    try {
      return this.noticeboardsService.findOne(noticeBoardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

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

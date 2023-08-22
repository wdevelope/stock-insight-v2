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
} from '@nestjs/common';
import { NoticeboardsService } from './noticeboards.service';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { UpdateNoticeboardDto } from './dto/update-noticeboard.dto';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { NoticeBoard } from './entities/noticeboard.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/noticeboards')
export class NoticeboardsController {
  constructor(private readonly noticeboardsService: NoticeboardsService) {}

  @Post()
  create(
    @CurrentUser() user: Users,
    @Body(ValidationPipe) createNoticeboardDto: CreateNoticeboardDto,
  ): Promise<void> {
    return this.noticeboardsService.create(createNoticeboardDto, user);
  }

  @Get()
  findAll(): Promise<NoticeBoard[]> {
    return this.noticeboardsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<NoticeBoard> {
    return this.noticeboardsService.findOne(id);
  }

  @Patch('/:id')
  update(
    @CurrentUser() user: Users,
    @Param('id') id: number,
    @Body(ValidationPipe) updateNoticeboardDto: UpdateNoticeboardDto,
  ): Promise<void> {
    return this.noticeboardsService.update(user, id, updateNoticeboardDto);
  }

  @Delete('/:id')
  remove(@CurrentUser() user: Users, @Param('id') id: number): Promise<void> {
    return this.noticeboardsService.remove(user, id);
  }
}

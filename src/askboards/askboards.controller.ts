import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AskboardsService } from './askboards.service';
import { CreateAskboardDto } from './dto/create-askboard.dto';
import { UpdateAskboardDto } from './dto/update-askboard.dto';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { AdminGuard } from 'src/askboards/jwt/admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/askboards')
export class AskboardsController {
  constructor(private readonly askboardsService: AskboardsService) {}

  // 문의 게시글 생성
  @Post()
  async create(
    @Body(ValidationPipe) createAskboardDto: CreateAskboardDto,
    @CurrentUser() user: Users,
  ) {
    return await this.askboardsService.create(createAskboardDto, user);
  }

  // 문의 게시글 전체 조회
  @Get()
  async findAll() {
    return await this.askboardsService.findAll();
  }

  // 문의 게시글 상세 조회
  @Get('/:id')
  @UseGuards(AdminGuard)
  async findOne(@Param('id') id: number) {
    return await this.askboardsService.findOne(+id);
  }

  // @Patch(':askBoardId')
  // async update(
  //   @CurrentUser() user: Users,
  //   @Param('askBoardId') id: string,
  //   @Body(ValidationPipe) updateAskboardDto: UpdateAskboardDto,
  // ) {
  //   return await this.askboardsService.update(+id, updateAskboardDto);
  // }

  // @Delete(':askBoardId')
  // async remove(@Param('askBoardId') id: string) {
  //   return await this.askboardsService.remove(+id);
  // }
}

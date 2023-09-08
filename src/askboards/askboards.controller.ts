import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { AskboardsService } from './askboards.service';
import { CreateAskboardDto } from './dto/create-askboard.dto';
import { UpdateAskboardDto } from './dto/update-askboard.dto';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { AdminGuard } from 'src/askboards/jwt/admin.guard';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('askboards')
@Controller('api/askboards')
export class AskboardsController {
  constructor(private readonly askboardsService: AskboardsService) {}

  // 문의 게시글 생성
  @ApiOperation({
    summary: '문의 게시물 생성 API.',
    description: '문의 게시물을 생성한다.',
  })
  @ApiBody({ type: [CreateAskboardDto] })
  @Post()
  async create(
    @Body(ValidationPipe) createAskboardDto: CreateAskboardDto,
    @CurrentUser() user: Users,
  ) {
    return await this.askboardsService.create(createAskboardDto, user);
  }

  // 문의 게시글 전체 조회
  @ApiOperation({
    summary: '문의 게시물 조회 API.',
    description: '문의 게시물을 조회한다.',
  })
  @Get()
  async findAll() {
    return await this.askboardsService.findAll();
  }

  // 문의 게시글 상세 조회
  @ApiOperation({
    summary: '문의 게시물 상세 조회 API.',
    description: '문의 게시물을 상세 조회한다.',
  })
  @Get('/:id')
  @UseGuards(AdminGuard)
  async findOne(@Param('id') id: number) {
    return await this.askboardsService.findOne(+id);
  }

  // 문의 게시글 업데이트
  @ApiOperation({
    summary: '문의 게시물 상세 조회 API.',
    description: '문의 게시물을 상세 조회한다.',
  })
  @Patch('/:askBoardId')
  async update(
    @CurrentUser() user: Users,
    @Param('askBoardId') id: string,
    @Body(ValidationPipe) updateAskboardDto: UpdateAskboardDto,
  ) {
    return await this.askboardsService.update(+id, updateAskboardDto);
  }

  // 문의게시판 삭제
  @Delete('/:askBoardId')
  async remove(@Param('askBoardId') id: number) {
    return await this.askboardsService.remove(+id);
  }

  // 문의게시판 답글 생성
  @Post('/:askBoardId/replies')
  async createReply(
    @Param('askBoardId') askBoardId: number,
    @Body(ValidationPipe) createReplyDto: CreateReplyDto,
    @CurrentUser() user: Users,
  ) {
    return await this.askboardsService.createReply(
      askBoardId,
      createReplyDto,
      user,
    );
  }

  // 문의게시판 답글 조회
  @Get('/:askBoardId/replies')
  async getReplies(@Param('askBoardId') askBoardId: number) {
    return await this.askboardsService.getReplies(askBoardId);
  }
}

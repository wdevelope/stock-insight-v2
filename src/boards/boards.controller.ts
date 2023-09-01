import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  BadRequestException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { FindBoardDto } from './dto/find-board.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('boards')
@Controller('api/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({
    summary: '게시물 생성 API.',
    description: '게시물을 생성한다.',
  })
  @ApiBody({ type: [CreateBoardDto] })
  create(
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
    @CurrentUser() user: Users,
  ): Promise<void> {
    try {
      return this.boardsService.create(createBoardDto, user);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  // 쿼리로 페이지, 페이지사이즈 값을 받아야함
  @Get('find')
  @ApiOperation({
    summary: '게시물 조회 API(title & description).',
    description: '게시물을 조건(title & description) 조회한다.',
  })
  @ApiBody({ type: [FindBoardDto] })
  findBoardBy(
    @Query('page') page: number = 1,
    @Query('title') title: string,
    @Query('description') description: string,
  ): Promise<Board[]> {
    const findBoardDto = { title, description };
    return this.boardsService.getBoardsByUserId(page, findBoardDto);
  }

  //페이지 네이션
  @ApiOperation({
    summary: '게시물 조회 API.',
    description: '게시물을 조회한다.',
  })
  @Get('/page')
  async all(
    @Query('page') page: number = 1,
  ): Promise<{ data: Board[]; meta: any }> {
    return await this.boardsService.paginate(page);
  }

  //보드 상세조회
  @ApiOperation({
    summary: '게시물 상세조회 API.',
    description: '게시물을 상세 조회한다.',
  })
  @Get('/:boardId')
  findOne(@Param('boardId') boardId: number): Promise<Board> {
    try {
      return this.boardsService.findOneWithDetails(boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  //보드 수정
  @Patch('/:boardId')
  @ApiOperation({
    summary: '게시물 수정 API.',
    description: '게시물을 수정한다.',
  })
  @ApiBody({ type: [UpdateBoardDto] })
  update(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    try {
      return this.boardsService.update(user, boardId, updateBoardDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
  // 보드삭제
  @Delete('/:boardId')
  @ApiOperation({
    summary: '게시물 삭제 API.',
    description: '게시물을 삭제한다.',
  })
  remove(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
  ): Promise<void> {
    try {
      return this.boardsService.remove(user, boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }
}

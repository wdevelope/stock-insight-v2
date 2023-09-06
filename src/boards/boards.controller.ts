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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

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

  @Get('find')
  @ApiOperation({
    summary: '게시물 조회 API(title & description).',
    description: '게시물을 조건(title & description) 조회한다.',
  })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'description', type: String, required: false })
  @ApiQuery({ name: 'nickname', type: String, required: false })
  findBoardBy(
    @Query('page') page: number = 1,
    @Query('title') title: string,
    @Query('description') description: string,
    @Query('nickname') nickname: string,
  ): Promise<{ data: Board[]; meta: any }> {
    try {
      const findBoardDto = { title, description, nickname };
      return this.boardsService.getBoardsByUserId(page, findBoardDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
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

  // 조회수 정렬
  @Get('/orderbyviewcount')
  @ApiOperation({
    summary: 'View count별로 정렬된 게시물 조회 API',
    description: 'View count별로 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByViewCount(
    @Query('page') page: number = 1,
    @Query('take') take: number = 15,
  ): Promise<{ data: Board[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByViewCount(page, take);
  }

  // 좋아요 정렬
  @Get('/orderbylikecount')
  @ApiOperation({
    summary: 'Like count별로 정렬된 게시물 조회 API',
    description: 'Like count별로 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByLikeCount(
    @Query('page') page: number = 1,
    @Query('take') take: number = 15,
  ): Promise<{ data: Board[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByLikeCount(page, take);
  }

  // 랭커유저 정렬
  @Get('/orderbyRanker')
  @ApiOperation({
    summary: '랭커유저별로 정렬된 게시물 조회 API',
    description: '랭커유저별로 날짜별 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByRanker(
    @Query('page') page: number = 1,
    @Query('take') take: number = 15,
  ): Promise<{ data: Board[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByRanker(page, take);
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
  //스케줄러를 이용하여 주기적으로 보드 인덱싱
  @Patch('/indexing')
  @ApiOperation({
    summary: 'DB 게시물 인덱싱 API.',
    description: '게시물을 상시적으로 인덱싱한다.',
  })
  boardsIndexing(): Promise<void> {
    try {
      return this.boardsService.indexing();
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

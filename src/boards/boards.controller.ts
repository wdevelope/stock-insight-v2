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
  InternalServerErrorException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { FindBoardDto } from './dto/find-board.dto';
import { Board } from './entities/board.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
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

  // 보드 일반검색
  @Get('/search')
  async search(
    @Query('page') page: number = 1,
    @Query() findBoardDto: FindBoardDto,
  ) {
    return await this.boardsService.searchByTitleAndDescriptionAndNickname(
      page,
      findBoardDto,
    );
  }

  //페이지 네이션
  @ApiOperation({
    summary: '게시물 조회 API.',
    description: '게시물을 조회한다.',
  })
  @Get('/page')
  async all(
    @Query('page') page: number = 1,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    try {
      return await this.boardsService.findAndCountWithPagination(page, 15);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching boards',
        error.message,
      );
    }
  }

  // 조회수 정렬
  @Get('/orderbyviewcount')
  @ApiOperation({
    summary: 'View count별로 정렬된 게시물 조회 API',
    description: 'View count별로 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByViewCount(
    @Query('page') page: number = 1,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByViewCount(page, 15);
  }

  // 좋아요 정렬
  @Get('/orderbylikecount')
  @ApiOperation({
    summary: 'Like count별로 정렬된 게시물 조회 API',
    description: 'Like count별로 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByLikeCount(
    @Query('page') page: number = 1,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByLikeCount(page, 15);
  }

  // 랭커유저 정렬
  @Get('/orderbyRanker')
  @ApiOperation({
    summary: '랭커유저별로 정렬된 게시물 조회 API',
    description: '랭커유저별로 날짜별 내림차순 정렬된 게시물을 조회한다.',
  })
  async getBoardsOrderByRanker(
    @Query('page') page: number = 1,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    return await this.boardsService.getBoardsOrderByRanker(page, 15);
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
      console.log(error);
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

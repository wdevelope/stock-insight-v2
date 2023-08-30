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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('boards')
@Controller('api/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: '새로운 게시물을 생성하였습니다.' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 게시물을 생성하였습니다.',
  })
  @ApiBadRequestResponse({ description: '게시물 생성에 실패하였습니다.' })
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

  @Get()
  findAll(): Promise<Board[]> {
    try {
      return this.boardsService.find();
    } catch (error) {
      throw new BadRequestException('CONTROLLE_ERROR');
    }
  }
  // 쿼리로 페이지, 페이지사이즈 값을 받아야함
  @Get('find')
  findBoardBy(
    @Query('page') page: number = 1,
    @Query('title') title: string,
    @Query('description') description: string,
  ): Promise<Board[]> {
    const findBoardDto = { title, description };
    return this.boardsService.getBoardsByUserId(page, findBoardDto);
  }

  @Get('/:boardId')
  findOne(@Param('boardId') boardId: number): Promise<Board> {
    try {
      return this.boardsService.findOne(boardId);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
  }

  @Patch('/:boardId')
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

  @Delete('/:boardId')
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

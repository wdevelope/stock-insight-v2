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

@UseGuards(JwtAuthGuard)
@Controller('api/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
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
  findAll(@Body() findBoardDto: FindBoardDto): Promise<Board[]> {
    try {
      return this.boardsService.find(findBoardDto);
    } catch (error) {
      throw new BadRequestException('CONTROLLER_ERROR');
    }
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

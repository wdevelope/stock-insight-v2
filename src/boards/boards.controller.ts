import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: Users,
  ): Promise<void> {
    return this.boardsService.create(createBoardDto, user);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Patch('/:id')
  update(
    @CurrentUser() user: Users,
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    return this.boardsService.update(user, id, updateBoardDto);
  }

  @Delete('/:id')
  remove(@CurrentUser() user: Users, @Param('id') id: number): Promise<void> {
    return this.boardsService.remove(user, id);
  }
}

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

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto): Promise<void> {
    return this.boardsService.create(createBoardDto);
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
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.boardsService.remove(id);
  }
}

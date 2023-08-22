import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: Users): Promise<void> {
    await this.boardsRepository.save({
      title: createBoardDto.title,
      description: createBoardDto.description,
      image: createBoardDto.image,
      join: createBoardDto.join,
      user: user,
    });
  }

  async findAll(): Promise<Board[]> {
    const board = await this.boardsRepository.find();
    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.boardsRepository.findOne({ where: { id } });
    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  async update(
    user: Users,
    id: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!existedBoard) {
      throw new NotFoundException();
    }

    await this.boardsRepository
      .createQueryBuilder()
      .update(Board)
      .set({
        title: updateBoardDto.title,
        description: updateBoardDto.description,
        image: updateBoardDto.image,
        join: updateBoardDto.join,
      })
      .where('id=:id', { id })
      .execute();
  }

  // romove는 find해서 나온 값을 넣어줘야하고 delete는 그냥 id 값 바로 넣어두 됨 추가적으로 엔티티에서 cascade 설정시 remove 사용
  async remove(user: Users, id: number): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    console.log(existedBoard);
    if (!existedBoard) {
      throw new NotFoundException();
    }
    await this.boardsRepository.manager.transaction(async (transaction) => {
      await transaction.delete(Comment, { board: { id } });
      await transaction.delete(Board, id);
    });
  }
}

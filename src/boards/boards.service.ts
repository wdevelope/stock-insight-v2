import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { Users } from 'src/users/users.entity';
import { BoardsRepository } from './boards.repository';
import { FindBoardDto } from './dto/find-board.dto';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardsRepository) {}

  // async find(): Promise<Board[]> {
  //   const board = await this.boardsRepository.find();
  //   if (!board) {
  //     throw new NotFoundException('보드가 존재하지 않습니다.');
  //   }
  //   try {
  //     return board;
  //   } catch (error) {
  //     throw new BadRequestException('SERVICE_ERROR');
  //   }
  // }

  //아마도 비슷한 내용 찾으려면 인클루드 돌려야함
  //한가지 코드로 findBoard, findUser, findTile+description 기능이 되는데 타이틀만 입력하면 안되고 디스크립션을 같이 입력해야 나옴
  async find(findBoardDto: FindBoardDto): Promise<Board[]> {
    const board = await this.boardsRepository.find({
      where: {
        title: findBoardDto.title,
        description: findBoardDto.description,
        user: { id: findBoardDto.userId },
      },
      // relations: ['user'], //유저 정보도 같이 보고싶으면
    });
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      return board;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async findOne(boardId: number): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      return board;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async create(createBoardDto: CreateBoardDto, user: Users): Promise<void> {
    try {
      await this.boardsRepository.save(createBoardDto, user);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async update(
    user: Users,
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: user.id } },
    });
    if (!existedBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.boardsRepository.update(updateBoardDto, boardId);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async remove(user: Users, boardId: number): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: user.id } },
    });
    console.log(existedBoard);
    if (!existedBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.boardsRepository.remove(existedBoard);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}

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
import { BoardSearchService } from 'src/search/search.service';
import { FindBoardDto } from './dto/find-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private readonly boardSearchService: BoardSearchService,
  ) {}

  async getBoardsByUserId(
    page: number,
    findBoardDto: FindBoardDto,
  ): Promise<Board[]> {
    // 보드 검색 서비스를 이용하여 유저 아이디로 보드를 검색합니다.
    return this.boardSearchService.searchByTitleAndDescription(
      page,
      findBoardDto,
    );
  }

  async findOneWithDetails(boardId: number): Promise<Board> {
    const board = await this.boardsRepository.findOneWith(boardId);
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    return board;
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

  async paginate(page: number = 1): Promise<{ data: Board[]; meta: any }> {
    const take = 20; // 페이지 상에서 보일 개수(LIMIT)

    const [boards, total] =
      await this.boardsRepository.findAndCountWithPagination(page, take);

    return {
      data: boards,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}

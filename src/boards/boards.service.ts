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
import { BoardSearchService } from './boards.search.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private readonly boardSearchService: BoardSearchService,
  ) {}

  async paginate(page: number = 1): Promise<{ data: Board[]; meta: any }> {
    /**페이지 상 보일 개수*/
    const take = 5;

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

  async getBoardsByUserId(
    page: number,
    findBoardDto: FindBoardDto,
  ): Promise<{ data: Board[]; meta: any }> {
    return this.boardSearchService.searchByTitleAndDescriptionAndNickname(
      page,
      findBoardDto,
    );
  }
  // 게시글 상세 조회
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

  @Cron('0 */3 * * * *')
  async indexing(): Promise<void> {
    const boards: Board[] = await this.boardsRepository.find();
    try {
      await this.boardSearchService.indexData(boards);
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

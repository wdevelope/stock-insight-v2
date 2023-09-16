import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ViewsRepository } from './views.repository';
import { Users } from 'src/users/users.entity';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
import { BoardsRepository } from 'src/boards/boards.repository';

@Injectable()
export class ViewsService {
  constructor(
    private viewsRepository: ViewsRepository,
    private boardsRepository: BoardsRepository,
  ) {}

  async createOrAdd(
    user: Users,
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    const existedBoard = await this.viewsRepository.findBoard(boardId);
    if (!existedBoard) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    const userId: number = user.id;
    const existedView = await this.viewsRepository.findOne({
      where: { user: { id: userId }, board: { id: boardId } },
    });

    try {
      await this.boardsRepository.increaseViewCount(boardId);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async viewTotalCnt(boardId: number): Promise<number> {
    // const boardFind = await this.viewsRepository.findBoard(boardId);
    const existedViews = await this.viewsRepository.findViewsByBoardId(boardId);
    if (!existedViews) {
      throw new NotFoundException();
    }
    try {
      return;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}

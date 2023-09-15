import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ViewsRepository } from './views.repository';
import { Users } from 'src/users/users.entity';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';

@Injectable()
export class ViewsService {
  constructor(private viewsRepository: ViewsRepository) {}

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
    const cnt = 0;
    const viewscount = existedBoard.viewCount;
    try {
      if (existedView === null) {
        updateBoardDto.viewCount = cnt + 1;
        await this.viewsRepository.create(user, boardId);
        await this.viewsRepository.update(boardId, updateBoardDto);
      } else {
        updateBoardDto.viewCount = viewscount + 1;
        await this.viewsRepository.update(boardId, updateBoardDto);
      }
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

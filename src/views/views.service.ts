import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ViewsRepository } from './views.repository';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ViewsService {
  constructor(private viewsRepository: ViewsRepository) {}

  async createOrAdd(user: Users, boardId: number): Promise<void> {
    const boardFind = await this.viewsRepository.findBoard(boardId);
    if (!boardFind) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    const userId = user.id;
    const viewFind = await this.viewsRepository.findOne({
      where: { user: { id: userId }, board: { id: boardId } },
    });

    try {
      if (viewFind === null) {
        await this.viewsRepository.create(user, boardId);
      } else {
        await this.viewsRepository.update(viewFind.id, viewFind.count);
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
      const totalViewCount = existedViews.reduce(
        (sum, view) => sum + view.count,
        0,
      );
      // console.log(totalViewCount);
      return totalViewCount;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}

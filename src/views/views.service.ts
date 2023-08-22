import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardViewsService } from './boardviews.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ViewsService {
  constructor(private boardViewsService: BoardViewsService) {}

  async createOrAdd(user: Users, boardId: number): Promise<void> {
    const boardFind = await this.boardViewsService.findBoard(boardId);
    if (!boardFind) {
      throw new NotFoundException();
    }
    const userId = user.id;
    const viewFind = await this.boardViewsService.findOne({
      where: { user: { id: userId }, board: { id: boardId } },
    });
    if (viewFind === null) {
      await this.boardViewsService.create(user, boardId);
    } else {
      await this.boardViewsService.update(viewFind.id, viewFind.count);
      console.log(viewFind.count);
    }
  }
  async viewTotalCnt(boardId: number): Promise<number> {
    const boardFind = await this.boardViewsService.findBoard(boardId);
    if (!boardFind) {
      throw new NotFoundException();
    }

    if (Array.isArray(boardFind.views)) {
      const totalViewCount = boardFind.views.reduce(
        (acc, view) => acc + view.count,
        0,
      );
      console.log(totalViewCount);
      return totalViewCount;
    }
  }
}

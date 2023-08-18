import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardLikesService } from './boardlikes.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class LikesService {
  constructor(private boardLikesService: BoardLikesService) {}

  async createOrDelete(user: Users, board: number): Promise<void> {
    const boardFind = await this.boardLikesService.findBoard(board);
    if (!boardFind) {
      throw new NotFoundException();
    }
    const userId: number = user.id;
    const likeFind = await this.boardLikesService.findOne({
      where: { user: { id: userId }, board: { id: board } },
    });
    if (likeFind === null) {
      await this.boardLikesService.save(user, board);
    } else {
      await this.boardLikesService.remove(likeFind);
    }
  }

  async likeTotalCnt(board: number): Promise<number> {
    const likeFind = await this.boardLikesService.find({
      where: { board: { id: board } },
    });
    const likeCnt = likeFind.length;
    console.log(likeCnt);
    return likeCnt;
  }
}

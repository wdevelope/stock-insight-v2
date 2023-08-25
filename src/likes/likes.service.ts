import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { Users } from 'src/users/users.entity';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
import { Board } from 'src/boards/entities/board.entity';

@Injectable()
export class LikesService {
  constructor(private likesRepository: LikesRepository) {}

  async createOrDelete(
    user: Users,
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    const existedBoard = await this.likesRepository.findBoard(boardId);
    if (!existedBoard) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    const userId: number = user.id;
    const existedLike = await this.likesRepository.findOne({
      where: { user: { id: userId }, board: { id: boardId } },
    });
    try {
      const likescount = existedBoard.likeCount;
      const cnt = 0;
      if (existedLike === null) {
        updateBoardDto.likeCount = cnt + 1;
        await this.likesRepository.save(user, boardId);
        await this.likesRepository.update(boardId, updateBoardDto);
      } else {
        updateBoardDto.likeCount = likescount - 1;
        await this.likesRepository.remove(existedLike);
        await this.likesRepository.update(boardId, updateBoardDto);
      }
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async likeTotalCnt(boardId: number): Promise<number> {
    const existedBoard = await this.likesRepository.findBoard(boardId);
    if (!existedBoard) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    try {
      return existedBoard.likeCount;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}

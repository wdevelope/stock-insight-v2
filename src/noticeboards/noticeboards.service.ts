import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { UpdateNoticeboardDto } from './dto/update-noticeboard.dto';
import { NoticeBoard } from './entities/noticeboard.entity';
import { Users } from 'src/users/users.entity';
import { NoticeBoardsRepository } from './noticeboards.repository';
import { NoticeBoardResponseDto } from './dto/noticeboard-response.dto';

@Injectable()
export class NoticeboardsService {
  constructor(private noticeBoardRepository: NoticeBoardsRepository) {}

  async find(): Promise<NoticeBoard[]> {
    const noticeBoard = await this.noticeBoardRepository.find();
    if (!noticeBoard) {
      throw new NotFoundException('공지사항 게시물이 존재하지 않습니다.');
    }
    try {
      return noticeBoard;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  // 페이지네이션 조회
  async findAndCountWithPagination(
    page: number,
    take: number,
  ): Promise<{ data: NoticeBoardResponseDto[]; meta: any }> {
    const [boards, totalCount] =
      await this.noticeBoardRepository.getBoardsWithSortingAndPagination(
        page,
        take,
        {
          'board.created_at': 'DESC',
        },
      );
    const lastPage = Math.ceil(totalCount / take);
    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  async findOne(noticeBoardId: number): Promise<NoticeBoard> {
    const existedNoticeBoard = await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId },
    });
    if (!existedNoticeBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      return existedNoticeBoard;
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async create(
    createNoticeBoardDto: CreateNoticeboardDto,
    user: Users,
  ): Promise<void> {
    try {
      await this.noticeBoardRepository.save(createNoticeBoardDto, user);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async update(
    user: Users,
    noticeBoardId: number,
    updateNoticeBoardDto: UpdateNoticeboardDto,
  ): Promise<void> {
    const existedNoticeBoard = await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId, user: { id: user.id } },
    });
    if (!existedNoticeBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.noticeBoardRepository.update(
        updateNoticeBoardDto,
        noticeBoardId,
      );
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async remove(user: Users, noticeBoardId: number): Promise<void> {
    const existedNoticeBoard = await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId, user: { id: user.id } },
    });
    console.log(existedNoticeBoard);
    if (!existedNoticeBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.noticeBoardRepository.remove(existedNoticeBoard);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}

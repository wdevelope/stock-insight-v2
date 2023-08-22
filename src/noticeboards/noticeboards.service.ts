import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { UpdateNoticeboardDto } from './dto/update-noticeboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoard } from './entities/noticeboard.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';

@Injectable()
export class NoticeboardsService {
  constructor(
    @InjectRepository(NoticeBoard)
    private noticeBoardRepository: Repository<NoticeBoard>,
  ) {}
  async create(
    createNoticeboardDto: CreateNoticeboardDto,
    user: Users,
  ): Promise<void> {
    await this.noticeBoardRepository.save({
      title: createNoticeboardDto.title,
      description: createNoticeboardDto.description,
      image: createNoticeboardDto.image,
      user: user,
    });
  }

  async findAll(): Promise<NoticeBoard[]> {
    const noticeBoard = await this.noticeBoardRepository.find();
    if (!noticeBoard) {
      throw new NotFoundException();
    }
    return noticeBoard;
  }

  async findOne(id: number): Promise<NoticeBoard> {
    const noticeBoard = await this.noticeBoardRepository.findOne({
      where: { id },
    });
    if (!noticeBoard) {
      throw new NotFoundException();
    }
    return noticeBoard;
  }

  async update(
    user: Users,
    id: number,
    updateNoticeboardDto: UpdateNoticeboardDto,
  ): Promise<void> {
    const existedNoticeBoard = await this.noticeBoardRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!existedNoticeBoard) {
      throw new NotFoundException();
    }

    await this.noticeBoardRepository
      .createQueryBuilder()
      .update(NoticeBoard)
      .set({
        title: updateNoticeboardDto.title,
        description: updateNoticeboardDto.description,
        image: updateNoticeboardDto.image,
      })
      .where('id=:id', { id })
      .execute();
  }

  async remove(user: Users, id: number): Promise<void> {
    const existedNoticeBoard = await this.noticeBoardRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!existedNoticeBoard) {
      throw new NotFoundException();
    }

    await this.noticeBoardRepository.manager.transaction(
      async (transaction) => {
        await transaction.delete(NoticeBoard, id);
      },
    );
  }
}

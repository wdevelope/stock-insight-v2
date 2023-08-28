import { BadRequestException, Injectable } from '@nestjs/common';
import { NoticeBoard } from './entities/noticeboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { UpdateNoticeboardDto } from './dto/update-noticeboard.dto';

@Injectable()
export class NoticeBoardsRepository {
  constructor(
    @InjectRepository(NoticeBoard)
    private noticeBoardsRepository: Repository<NoticeBoard>,
  ) {}

  async find(): Promise<NoticeBoard[] | undefined> {
    try {
      return this.noticeBoardsRepository.find();
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findOne(
    option: FindOneOptions<NoticeBoard>,
  ): Promise<NoticeBoard | undefined> {
    try {
      return this.noticeBoardsRepository.findOne(option);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async save(
    createNoticeBoardDto: CreateNoticeboardDto,
    user: Users,
  ): Promise<void> {
    try {
      await this.noticeBoardsRepository.save({
        title: createNoticeBoardDto.title,
        description: createNoticeBoardDto.description,
        image: createNoticeBoardDto.image,
        user: user,
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async update(
    updateBoardDto: UpdateNoticeboardDto,
    noticeBoardId: number,
  ): Promise<void> {
    try {
      await this.noticeBoardsRepository
        .createQueryBuilder()
        .update(NoticeBoard)
        .set({
          title: updateBoardDto.title,
          description: updateBoardDto.description,
          image: updateBoardDto.image,
        })
        .where('id=:id', { id: noticeBoardId })
        .execute();
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async remove(existedNoticeBoard): Promise<void> {
    try {
      await this.noticeBoardsRepository.manager.transaction(
        async (transaction) => {
          await transaction.remove(existedNoticeBoard);
        },
      );
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
}

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
      return await this.noticeBoardsRepository
        .createQueryBuilder('noticeBoard')
        .leftJoinAndSelect('noticeBoard.user', 'user') // noticeBoard 엔터티에서 user와의 관계를 기반으로 조인
        .select(['noticeBoard', 'user.nickname', 'user.imgUrl']) // noticeBoard의 모든 컬럼과 user의 nickname만 선택
        .getMany(); // 여러 개의 결과를 가져옴
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findOne(
    option: FindOneOptions<NoticeBoard>,
  ): Promise<NoticeBoard | undefined> {
    try {
      return this.noticeBoardsRepository.findOne({
        ...option,
        relations: ['user'],
      });
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

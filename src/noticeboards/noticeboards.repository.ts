import { BadRequestException, Injectable } from '@nestjs/common';
import { NoticeBoard } from './entities/noticeboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { CreateNoticeboardDto } from './dto/create-noticeboard.dto';
import { UpdateNoticeboardDto } from './dto/update-noticeboard.dto';
import { NoticeBoardResponseDto } from './dto/noticeboard-response.dto';

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

  public async getBoardsWithSortingAndPagination(
    page: number,
    take: number,
    order: { [key: string]: 'ASC' | 'DESC' },
    additionalWhere?: { [key: string]: any },
  ): Promise<[NoticeBoardResponseDto[], number]> {
    const qb = this.noticeBoardsRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .select([
        'board.id',
        'board.title',
        'board.description',
        'board.image',
        'board.likeCount',
        'board.viewCount',
        'board.created_at',
        'board.updated_at',
        'user.nickname',
        'user.imgUrl',
        'user.status',
      ])
      .orderBy(order)
      .skip((page - 1) * take)
      .take(take);

    if (additionalWhere) {
      for (const [key, value] of Object.entries(additionalWhere)) {
        qb.andWhere(`${key} = :value`, { value });
      }
    }

    const [results, total] = await qb.getManyAndCount();

    const formattedBoards = results.map((result) => ({
      id: result.id,
      title: result.title,
      description: result.description,
      image: result.image,
      created_at: result.created_at,
      updated_at: result.updated_at,
      nickname: result.user.nickname,
    }));

    return [formattedBoards, total];
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

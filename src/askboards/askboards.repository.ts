import { BadRequestException, Injectable } from '@nestjs/common';
import { Askboard } from './entities/askboard.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAskboardDto } from './dto/create-askboard.dto';
import { UpdateAskboardDto } from './dto/update-askboard.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class AskboardsRepository {
  constructor(
    @InjectRepository(Askboard)
    private askboardsRepository: Repository<Askboard>,
  ) {}

  // 문의 게시글 생성
  async createAndSave(
    createAskboardDto: CreateAskboardDto,
    user: Users,
  ): Promise<Askboard> {
    const askboard = this.askboardsRepository.create(createAskboardDto);
    askboard.user = user;
    return this.askboardsRepository.save(askboard);
  }

  // 문의 게시글 전체 조회
  async findAllWithUserNickname(
    page: number = 1,
  ): Promise<{ data: Askboard[]; meta: any }> {
    const take = 15;

    const query: SelectQueryBuilder<Askboard> =
      this.askboardsRepository.createQueryBuilder('askboard');

    query
      .leftJoinAndSelect('askboard.user', 'user')
      .select(['askboard', 'user.nickname', 'user.imgUrl'])
      .orderBy('askboard.created_at', 'DESC')
      .skip((page - 1) * take)
      .take(take);

    const boards = await query.getMany();
    const totalCount = await query.getCount();
    const lastPage = Math.ceil(totalCount / take);

    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }
  // 닉네임 검색
  async findByNickname(
    nickname: string,
    page: number = 1,
  ): Promise<{ data: Askboard[]; meta: any }> {
    const take = 15; // 한 페이지에 표시할 게시글 수

    const query: SelectQueryBuilder<Askboard> =
      this.askboardsRepository.createQueryBuilder('askboard');

    query
      .leftJoinAndSelect('askboard.user', 'user')
      .select(['askboard', 'user.nickname', 'user.imgUrl'])
      .where('user.nickname = :nickname', { nickname })
      .skip((page - 1) * take)
      .take(take);

    const boards = await query.getMany();
    const totalCount = await query.getCount();
    const lastPage = Math.ceil(totalCount / take);

    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  // 문의 게시글 상세 조회
  async findOneWith(boardId: number): Promise<Askboard | undefined> {
    try {
      const queryBuilder: SelectQueryBuilder<Askboard> =
        this.askboardsRepository.createQueryBuilder('askboard');

      const result = await queryBuilder
        .leftJoinAndSelect('askboard.user', 'users')
        .where('askboard.id = :boardId', { boardId })
        .select([
          'askboard.id',
          'askboard.title',
          'askboard.description',
          'askboard.created_at',
          'askboard.updated_at',
          'users.nickname',
          'users.imgUrl',
          'users.id',
        ])
        .getOne();

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  // 문의게시글 수정
  async updateAskboard(
    id: number,
    updateAskboardDto: UpdateAskboardDto,
  ): Promise<Askboard> {
    await this.askboardsRepository.update(id, updateAskboardDto); // 직접 askboardsRepository의 update() 메소드를 사용합니다.
    const updatedAskboard = await this.findOneWith(id);
    if (!updatedAskboard) {
      throw new Error('Failed to update askboard.');
    }
    return updatedAskboard;
  }

  // 문의 게시글 저장
  async save(createAskboardDto: CreateAskboardDto, user: Users): Promise<void> {
    try {
      await this.askboardsRepository.save({
        ...createAskboardDto,
        user: user,
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  // 문의게시판 삭제
  async remove(existedAskboard): Promise<void> {
    try {
      await this.askboardsRepository.manager.transaction(
        async (transaction) => {
          await transaction.remove(existedAskboard);
        },
      );
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
}

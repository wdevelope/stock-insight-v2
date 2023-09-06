import { BadRequestException, Injectable } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { Users } from 'src/users/users.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    private readonly entityManager: EntityManager, // Add this line
  ) {}

  async find(): Promise<Board[] | undefined> {
    try {
      const user = await this.boardsRepository.find({
        relations: ['user'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findBy(option: FindOneOptions<Board>): Promise<Board[] | undefined> {
    try {
      return this.boardsRepository.find(option);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findOne(option: FindOneOptions<Board>): Promise<Board | undefined> {
    try {
      return this.boardsRepository.findOne(option);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  //보드 상세 조회
  async findOneWith(boardId: number): Promise<Board | undefined> {
    try {
      const result = await this.entityManager.query(
        `
            SELECT 
                board.id,
                board.title,
                board.description,
                board.created_at,
                board.updated_at,
                board.likeCount,
                users.nickname,
                users.imgUrl
            FROM board
            LEFT JOIN users ON users.id = board.userId
            WHERE board.id = ? 
            `,
        [boardId],
      );

      return result[0];
    } catch (error) {
      console.log(error);
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async save(createBoardDto: CreateBoardDto, user: Users): Promise<void> {
    try {
      await this.boardsRepository.save({
        title: createBoardDto.title,
        description: createBoardDto.description,
        image: createBoardDto.image,
        likeCount: createBoardDto.likeCount,
        user: user,
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async update(updateBoardDto: UpdateBoardDto, boardId: number): Promise<void> {
    try {
      await this.boardsRepository.manager.transaction(async (transaction) => {
        await transaction
          .createQueryBuilder()
          .update(Board)
          .set({
            title: updateBoardDto.title,
            description: updateBoardDto.description,
            image: updateBoardDto.image,
            likeCount: updateBoardDto.likeCount,
            viewCount: updateBoardDto.viewCount,
          })
          .where('id=:id', { id: boardId })
          .execute();
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async remove(existedBoard): Promise<void> {
    try {
      await this.boardsRepository.manager.transaction(async (transaction) => {
        await transaction.remove(existedBoard);
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findAndCountWithPagination(
    page: number,
    take: number,
  ): Promise<[Board[], number]> {
    const qb = this.boardsRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.user', 'user')
      .select(['board', 'user.nickname', 'user.imgUrl', 'user.status']) // board와 user의 nickname,imgUrl 선택
      .orderBy('board.created_at', 'DESC')
      .skip((page - 1) * take)
      .take(take);

    const [boards, total] = await qb.getManyAndCount();

    return [boards, total];
  }
  // 조회수 정렬
  async getBoardsOrderByViewCount(
    page: number,
    take: number,
  ): Promise<[Board[], number]> {
    try {
      const qb = this.boardsRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .select(['board', 'user.nickname', 'user.imgUrl', 'user.status'])
        .orderBy('board.viewCount', 'DESC')
        .skip((page - 1) * take)
        .take(take);

      const [boards, total] = await qb.getManyAndCount();

      return [boards, total];
    } catch (error) {
      console.error('Error fetching boards order by view count', error);
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
  // 좋아요 정렬
  async getBoardsOrderByLikeCount(
    page: number,
    take: number,
  ): Promise<[Board[], number]> {
    try {
      const qb = this.boardsRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .select(['board', 'user.nickname', 'user.imgUrl', 'user.status'])
        .orderBy('board.likeCount', 'DESC')
        .skip((page - 1) * take)
        .take(take);

      const [boards, total] = await qb.getManyAndCount();

      return [boards, total];
    } catch (error) {
      console.error('Error fetching boards order by view count', error);
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
  // 랭커유저 정렬
  async getBoardsOrderByRanker(
    page: number,
    take: number,
  ): Promise<[Board[], number]> {
    try {
      const qb = this.boardsRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .select(['board', 'user.nickname', 'user.imgUrl', 'user.status'])
        .where('user.status = :status', { status: 'ranker' })
        .orderBy('board.created_at', 'DESC')
        .skip((page - 1) * take)
        .take(take);

      const [boards, total] = await qb.getManyAndCount();

      return [boards, total];
    } catch (error) {
      console.error('Error Details:', error);
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
}

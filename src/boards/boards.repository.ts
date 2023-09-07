import { BadRequestException, Injectable } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
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

  public async getBoardsWithSortingAndPagination(
    page: number,
    take: number,
    order: { [key: string]: 'ASC' | 'DESC' },
    additionalWhere?: { [key: string]: any },
  ): Promise<[BoardResponseDto[], number]> {
    const qb = this.boardsRepository
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
      likeCount: result.likeCount,
      viewCount: result.viewCount,
      created_at: result.created_at,
      updated_at: result.updated_at,
      nickname: result.user.nickname,
      imgUrl: result.user.imgUrl,
      status: result.user.status,
    }));

    return [formattedBoards, total];
  }
}

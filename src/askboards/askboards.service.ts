import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAskboardDto } from './dto/update-askboard.dto';
import { Askboard } from './entities/askboard.entity';
import { Reply } from './entities/reply.entity';
import { Users } from 'src/users/users.entity';
import { AskboardsRepository } from './askboards.repository';
import { CreateAskboardDto } from './dto/create-askboard.dto';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';

// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AskboardsService {
  constructor(
    private askboardRepository: AskboardsRepository,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  // 문의 게시글 생성
  async create(
    createAskboardDto: CreateAskboardDto,
    user: Users,
  ): Promise<Askboard> {
    return this.askboardRepository.createAndSave(createAskboardDto, user);
  }

  // 문의 게시글 전체 게시글 정보 조회
  async findAll(): Promise<Askboard[]> {
    return await this.askboardRepository.findAllWithUserNickname();
  }

  // 문의 게시글 상세 조회
  async findOne(id: number): Promise<Askboard> {
    return this.askboardRepository.findOneWith(id);
  }

  // 문의 게시글 수정
  async update(
    id: number,
    updateAskboardDto: UpdateAskboardDto,
  ): Promise<Askboard> {
    return await this.askboardRepository.updateAskboard(id, updateAskboardDto);
  }

  // 문의 게시글 삭제
  async remove(id: number): Promise<void> {
    const askboard = await this.findOne(id);
    if (!askboard) {
      throw new NotFoundException('Askboard not found');
    }
    await this.askboardRepository.remove(askboard);
  }

  // 문의글 답글 생성
  async createReply(
    askBoardId: number,
    replyDto: CreateReplyDto,
    user: Users,
  ): Promise<Reply> {
    const askboard = await this.askboardRepository.findOneWith(askBoardId);
    if (!askboard) {
      throw new NotFoundException('Askboard not found');
    }

    const reply = this.replyRepository.create(replyDto);

    reply.askboard = askboard;

    reply.user = user;

    return await this.replyRepository.save(reply);
  }

  // 문의글 답글 조회
  async getReplies(askBoardId: number): Promise<Reply[]> {
    return await this.replyRepository
      .createQueryBuilder('reply')
      .select([
        'reply.id',
        'reply.title',
        'reply.description',
        'reply.created_at',
        'reply.updated_at',
        'reply.askboard',
        'user.nickname',
      ])
      .innerJoin('reply.user', 'user')
      .where('reply.askboardId = :askBoardId', { askBoardId })
      .getMany();
  }
}

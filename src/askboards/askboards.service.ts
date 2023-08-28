import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAskboardDto } from './dto/create-askboard.dto';
import { UpdateAskboardDto } from './dto/update-askboard.dto';
import { Askboard } from './entities/askboard.entity';
import { Users } from 'src/users/users.entity';
import { AskboardsRepository } from './askboards.repository';
// import { Repository } from 'typeorm';

@Injectable()
export class AskboardsService {
  constructor(private askboardRepository: AskboardsRepository) {}

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
    return this.askboardRepository.findOne(id);
  }

  // async update(
  //   id: number,
  //   updateAskboardDto: UpdateAskboardDto,
  // ): Promise<Askboard> {
  //   await this.findOne(id);
  //   await this.askboardRepository.update(id, updateAskboardDto);
  //   return this.findOne(id);
  // }

  // async remove(id: number): Promise<void> {
  //   const askboard = await this.findOne(id);
  //   await this.askboardRepository.remove(askboard);
  // }
}

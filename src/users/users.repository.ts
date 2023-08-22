import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { KakaoLoginAuthDto } from '../auth/dto/kakao.dto';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private readonly dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async createUser(user: UserCreateDto): Promise<Users> {
    const newUser = this.create(user);
    return await this.save(newUser);
  }

  async findUserByIdWithoutPassword(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'imgUrl'],
    });
    return user;
  }

  async findUserById(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id },
    });
    return user;
  }

  async updateUser(user: Users, data: Partial<UserUpdateDto>): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
  }

  async deleteUser(id: number): Promise<object> {
    const result = await this.delete({ id: id });
    return result;
  }

  async createKakao(user: KakaoLoginAuthDto): Promise<Users> {
    const newUser = this.create(user);
    return await this.save(newUser);
  }

  async findUserByThirdPartyId(
    thirdPartyId: string,
    provider: string,
  ): Promise<Users | null> {
    const user = await this.findOne({ where: { thirdPartyId, provider } });

    return user;
  }

  async createUserFromOAuth(
    thirdPartyId: string,
    email: string,
    nickname: string,
    provider: string,
  ): Promise<Users> {
    const newUser = this.create({ thirdPartyId, provider, email, nickname });
    const savedUser = await this.save(newUser);

    return savedUser;
  }
}

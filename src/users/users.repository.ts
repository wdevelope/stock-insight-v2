import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { PointDto } from './dto/point.dto';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private readonly dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await this.findOne({ where: { email, deletedAt: null } });
    return user;
  }

  async createUser(user: UserCreateDto): Promise<Users> {
    const newUser = this.create(user);
    return await this.save(newUser);
  }

  async findUserByIdWithoutPassword(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id, deletedAt: null },
      select: [
        'id',
        'email',
        'nickname',
        'imgUrl',
        'point',
        'status',
        'is_subscribe',
      ],
    });
    return user;
  }

  async findUserById(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id, deletedAt: null },
    });
    return user;
  }

  async updateUser(user: Users, data: Partial<UserUpdateDto>): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
  }

  async deleteUser(id: number): Promise<object> {
    const result = await this.softDelete({ id: id });
    return result;
  }

  async updatePoint(user: Users, data: PointDto): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
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

  async updateUserStatus(user: Users, data: StatusDto): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
  }

  async getQuizDay() {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const user = await this.createQueryBuilder('u')
      .select('u.id')
      .addSelect('u.point')
      .leftJoinAndSelect('u.quiz', 'quiz')
      .where('quiz.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .getRawMany();

    return user;
  }
}

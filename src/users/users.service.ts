import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateRequestDto } from './dto/updateRequest.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(body: SignUpDto) {
    const { email, password, confirm, nickname } = body;
    const isUserExist = await this.usersRepository.findUserByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }

    if (password !== confirm) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser({
      email,
      password: hashedPassword,
      nickname,
    });

    return {
      statusCode: 201,
      message: '회원가입 성공',
    };
  }

  async updateUser(id: number, body: Partial<UpdateRequestDto>) {
    const { password, newPassword, newConfirm, nickname } = body;
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('password를 확인해주세요.');
    }

    if (newPassword !== newConfirm) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    } else {
      let hashedPassword: string | undefined;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      await this.usersRepository.updateUser(user, {
        password: hashedPassword || user.password,
        nickname: nickname || user.nickname,
      });

      return {
        statusCode: 201,
        message: '회원정보 수정 성공',
      };
    }
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    await this.usersRepository.deleteUser(id);

    return {
      statusCode: 201,
      message: '회원정보 삭제 성공',
    };
  }
  // answer가 true 면 point 를 얻고, keep은 그대로, false 면 point를 잃는다. 대신 0점 밑으로는 내려가지 않는다.
  // @Cron('53 15 * * 1-5')
  async updatePoint() {
    const userQuiz = await this.usersRepository.getQuizDay();
    userQuiz.forEach(async (userQuiz) => {
      const id = userQuiz.u_id;
      const point = userQuiz.u_point;
      const answer = userQuiz.quiz_correct;

      let newPoint: number;
      if (answer === 'false') {
        if (point > 0) {
          newPoint = point - 5;
        } else {
          newPoint = point;
        }
      } else if (answer === 'true') {
        newPoint = point + 10;
      } else if (answer === 'keep') {
        newPoint = point;
      }

      const user = await this.usersRepository.findOne({ where: { id } });

      await this.usersRepository.updatePoint(user, {
        point: newPoint,
      });
    });
  }

  // 포인트에 따라서 유저의 스테이터스가 변화한다.
  // @Cron('0 16 * * 1-5')
  async updateUserStatus() {
    const userId = await this.usersRepository.getQuizDay();
    userId.forEach(async (userId) => {
      const id = userId.u_id;
      const user = await this.usersRepository.findOne({ where: { id } });

      let newStatus: string;
      if (user.point > 199) {
        newStatus = 'ranker';
      } else {
        newStatus = 'user';
      }

      await this.usersRepository.updateUserStatus(user, {
        status: newStatus,
      });
    });
  }

  //페이지네이션
  async paginate(page: number = 1): Promise<any> {
    const take = 10; //페이지 상에서 보일 개수(LIMIT)

    const [users, total] = await this.usersRepository.findAndCount({
      take,
      skip: (page - 1) * take, //skip이 OFFSET
    });

    return {
      data: users.map((user) => {
        // password, imgUrl을 제외한 data만 넘겨주기
        const { password, imgUrl, createdAt, updatedAt, deletedAt, ...data } =
          user;

        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async updateSubscribe(userId: number, body: Partial<SubscribeDto>) {
    const data: SubscribeDto = new SubscribeDto();
    data.is_subscribe = true;
    const { amount } = body;

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({ is_subscribe: data.is_subscribe, amount: amount })
      .where('id=:id', { id: userId })
      .execute();
  }
}

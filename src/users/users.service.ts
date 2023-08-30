import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateRequestDto } from './dto/updateRequest.dto';
import { PointDto } from './dto/point.dto';

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
    const { password, newPassword, nickname } = body;
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
  // answer가 true 면 point 를 얻고, false 면 point 를 잃는다.
  async updatePoint(id: number, body: PointDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const answer = user.quiz[0].answer;

    let newPoint: number;
    if (!answer) {
      if (user.point > 0) {
        newPoint = user.point - 5;
      } else {
        newPoint = user.point;
      }
    } else {
      newPoint = user.point + 10;
    }

    await this.usersRepository.updatePoint(user, {
      point: newPoint,
    });

    return {
      statusCode: 201,
      message: '포인트 수정 성공',
    };
  }
  // 포인트 업데이트 이후에 이 함수가 실행 되어야 한다.
  async updateUserStatus(id: number) {
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

    return {
      statusCode: 201,
      message: '유저랭킹 수정 성공',
    };
  }

  //페이지네이션
  async paginate(page: number = 1): Promise<any> {
    const take = 2; //페이지 상에서 보일 개수(LIMIT)

    const [users, total] = await this.usersRepository.findAndCount({
      take,
      skip: (page - 1) * take, //skip이 OFFSET
    });

    return {
      data: users.map((user) => {
        // password, imgUrl을 제외한 data만 넘겨주기
        const { password, imgUrl, ...data } = user;

        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}

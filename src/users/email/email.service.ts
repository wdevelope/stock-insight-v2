import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersRepository } from '../users.repository';
import { EmailDto } from '../dto/email.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async authEmail(body: EmailDto): Promise<void> {
    const { email } = body;

    const getRandomCode = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomCode = getRandomCode(111111, 999999);

    if (randomCode) {
      await this.cacheManager.get(email);
    }
    await this.cacheManager.set(email, randomCode, { ttl: 300 });

    await this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'gwagbyeol@naver.com', // Senders email address
        subject: '✔ stock insight 회원가입 인증번호입니다. ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: `가입 인증번호는 ${randomCode} 입니다.`,
          username: 'stock insight',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async verifyEmail(email: string, randomCode) {
    const cache_verify = await this.cacheManager.get(email);
    //console.log(cache_verify);
    if (!cache_verify) {
      throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.');
    } else if (cache_verify !== randomCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    } else {
      await this.cacheManager.del(email); // 인증이 완료되면 삭제
    }
  }

  async resetPassword(body: EmailDto): Promise<void> {
    const { email } = body;

    const existEmail = await this.usersRepository.findUserByEmail(email);

    if (!existEmail) {
      throw new NotFoundException('가입한 이메일 주소가 없습니다.');
    } else {
      const getRandomPassword = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      };

      const randomPassword = getRandomPassword(11111111, 99999999);

      let hashedPassword: string | undefined;
      if (randomPassword) {
        hashedPassword = await bcrypt.hash(randomPassword, 10);
      }

      await this.usersRepository.updateUser(existEmail, {
        password: hashedPassword || existEmail.password,
      });

      await this.mailerService
        .sendMail({
          to: email, // List of receivers email address
          from: 'gwagbyeol@naver.com', // Senders email address
          subject: `✔ stock insight에서 ${email}로 보냈습니다. ✔`,
          template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
          context: {
            // Data to be sent to template engine.
            code: `임시 비밀번호는 ${randomPassword} 입니다.`,
            username: 'stock insight',
          },
        })
        .then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersRepository } from '../users.repository';
import { EmailDto } from '../dto/email.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository,
  ) {}

  // async authEmail(body: EmailDto): Promise<void> {
  //   const { email } = body;

  //   const getRandomCode = (min, max) => {
  //     min = Math.ceil(min);
  //     max = Math.floor(max);
  //     return Math.floor(Math.random() * (max - min)) + min;
  //   };

  //   const randomCode = getRandomCode(111111, 999999);

  //   if (randomCode) {
  //     await this.cacheManager.get(email);
  //   }
  //   await this.cacheManager.set(email, randomCode, { ttl: 300 });

  //   await this.mailerService
  //     .sendMail({
  //       to: email, // List of receivers email address
  //       from: process.env.EMAIL_ID, // Senders email addresse
  //       subject: '✔ stock insight 회원가입 인증번호입니다. ✔',
  //       template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
  //       context: {
  //         // Data to be sent to template engine.
  //         code: `가입 인증번호는 ${randomCode} 입니다.`,
  //         username: 'stock insight',
  //       },
  //     })
  //     .then((success) => {
  //       console.log(success);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // async verifyEmail(email: string, randomCode) {
  //   const cache_verify = await this.cacheManager.get(email);
  //   //console.log(cache_verify);
  //   if (!cache_verify) {
  //     throw new NotFoundException('해당 메일로 전송된 인증번호가 없습니다.');
  //   } else if (cache_verify !== randomCode) {
  //     throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
  //   } else {
  //     await this.cacheManager.del(email); // 인증이 완료되면 삭제
  //   }
  // }

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
      const dataString = randomPassword.toString(); // 숫자를 문자열로 변환

      let hashedPassword: string | undefined;
      if (dataString) {
        hashedPassword = await bcrypt.hash(dataString, 10);
      }

      await this.usersRepository.updateUser(existEmail, {
        password: hashedPassword,
      });

      await this.mailerService
        .sendMail({
          to: email, // List of receivers email address
          from: process.env.EMAIL_ID, // Senders email address
          subject: `✔ stock insight에서 ${email}의 임시비밀번호를 보냈습니다. ✔`,
          template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
          context: {
            // Data to be sent to template engine.
            code: `임시 비밀번호는 ${randomPassword} 입니다. 로그인 하시면 비밀번호 변경을 해주세요`,
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

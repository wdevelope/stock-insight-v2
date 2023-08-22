import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersRepository } from '../users.repository';
import { EmailDto } from '../dto/email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async authEmail(body: EmailDto): Promise<void> {
    const { email } = body;

    const getRandomCode = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    const randomCode = getRandomCode(111111, 999999);

    await this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'gwagbyeol@naver.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: `The Authentication code is ${randomCode}`,
          username: 'test email',
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

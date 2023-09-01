import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuizDto {
  // upANDdown (제출 시 값)
  @ApiProperty()
  answer: boolean;
  // user answer
}

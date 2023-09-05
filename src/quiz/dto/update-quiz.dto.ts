import { ApiProperty } from '@nestjs/swagger';
export class UpdateQuizDto {
  @ApiProperty()
  correct: string;
}

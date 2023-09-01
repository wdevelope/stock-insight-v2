import { ApiProperty } from '@nestjs/swagger';
export class CreateQuizDto {
  @ApiProperty()
  upANDdown: string;
  @ApiProperty()
  stockName: string;
  @ApiProperty()
  updated_day: string;
}

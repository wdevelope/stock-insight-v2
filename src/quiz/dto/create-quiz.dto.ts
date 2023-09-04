import { ApiProperty } from '@nestjs/swagger';
export class CreateQuizDto {
  @ApiProperty()
  upANDdown: string;
  @ApiProperty()
  updated_day: string;
  @ApiProperty()
  stockId: string;
}

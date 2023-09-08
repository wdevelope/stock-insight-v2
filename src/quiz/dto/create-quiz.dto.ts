import { ApiProperty } from '@nestjs/swagger';
export class CreateQuizDto {
  @ApiProperty()
  upANDdown: string;
  @ApiProperty()
  updated_date: string;
  @ApiProperty()
  stockId: string;
}

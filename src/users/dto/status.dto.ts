import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {
  @ApiProperty({ description: '스테이터스' })
  status: string;
}

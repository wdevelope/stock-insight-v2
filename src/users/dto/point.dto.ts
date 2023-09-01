import { ApiProperty } from '@nestjs/swagger';

export class PointDto {
  @ApiProperty({ description: '포인트' })
  point: number;
}

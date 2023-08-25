import { IsBoolean } from 'class-validator';

export class PointDto {
  point: number;

  @IsBoolean()
  answer: boolean;
}

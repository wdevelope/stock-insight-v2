import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  image: string;
  join?: number;
}

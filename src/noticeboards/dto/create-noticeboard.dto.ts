import { IsString } from 'class-validator';

export class CreateNoticeboardDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
}

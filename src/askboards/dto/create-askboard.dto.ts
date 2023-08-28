import { IsString } from 'class-validator';

export class CreateAskboardDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

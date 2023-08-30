import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

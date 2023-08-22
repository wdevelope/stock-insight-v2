import { IsOptional, IsString, IsEmail } from 'class-validator';

export class KakaoLoginAuthDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  nickname?: string;

  @IsEmail()
  email: string;
}

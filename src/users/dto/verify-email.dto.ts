import { Token } from '@/types/user-type';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @Transform(({ value }) => value.trim() as Token)
  @IsString()
  readonly signupVerifyToken: Token;
}

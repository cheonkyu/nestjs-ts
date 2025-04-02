import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Email, Password } from '@/types/user-type';

export class UserLoginDto {
  @IsString()
  @Transform(({ value }) => value.trim() as Email)
  readonly email: Email;
  @IsString()
  @Transform(({ value }) => value.trim() as Password)
  readonly password: Password;
}

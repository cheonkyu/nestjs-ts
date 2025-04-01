import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Email, Name, Password } from 'src/types/user-type';

export class CreateUserDto {
  @Transform(({ value }) => value.trim() as Name)
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: Name;
  @IsString()
  @IsEmail()
  @MaxLength(60)
  @Transform(({ value }) => value as Email)
  readonly email: Email;
  @Transform(({ value, obj }) => {
    if (obj.password.includes(obj.name.trim())) {
      throw new BadRequestException(
        'password는 name과 같은 문자열을 포함할 수 없습니다.',
      );
    }
    return value.trim() as Password;
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}

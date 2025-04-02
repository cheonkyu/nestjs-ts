import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from '@/config/authConfig';
import { Email, Name } from '@/types/user-type';

interface User {
  id: string;
  name: Name;
  email: Email;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    if (!this.config.jwtSecret) {
      throw new Error('JWT secret is not defined');
    }
    const payload = { ...user };
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'cheonkyu.io',
      issuer: 'cheonkyu.io',
    });
  }

  verify(jwtString: string) {
    if (!this.config.jwtSecret || !jwtString) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;
      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

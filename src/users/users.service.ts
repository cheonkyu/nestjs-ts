import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Email, Token } from 'src/types/user-type';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1() as Token;

    await this.saveUser(email);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
    return 'This action adds a new user';
  }

  async checkUserExists(email: Email) {
    return false;
  }

  async saveUser(email: Email) {
    return;
  }

  async sendMemberJoinEmail(email: Email, signupVerifyToken: Token) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    throw new Error('');
  }

  async login(email: string, password: string) {
    console.log(email, password);
    throw new Error('');
  }
}

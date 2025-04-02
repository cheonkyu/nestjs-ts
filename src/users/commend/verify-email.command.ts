import { ICommand } from '@nestjs/cqrs';
import { Token } from '@/types/user-type';

export class VerifyEmailCommand implements ICommand {
  constructor(readonly signupVerifyToken: Token) {}
}

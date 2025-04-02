import { ICommand } from '@nestjs/cqrs';
import { Email, Password } from '@/types/user-type';

export class LoginCommand implements ICommand {
  constructor(readonly email: Email, readonly password: Password) {}
}

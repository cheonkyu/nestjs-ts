import { ICommand } from '@nestjs/cqrs';
import { Email, Password } from 'src/types/user-type';

export class LoginCommand implements ICommand {
  constructor(readonly email: Email, readonly password: Password) {}
}

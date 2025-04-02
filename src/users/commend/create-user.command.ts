import { ICommand } from '@nestjs/cqrs';
import { Email, Name, Password } from '@/types/user-type';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly name: Name,
    readonly email: Email,
    readonly password: Password,
  ) {}
}

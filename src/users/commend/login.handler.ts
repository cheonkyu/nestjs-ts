import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoginCommand } from './login.command';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_REPOSITORY_PROXY')
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async execute(command: LoginCommand): Promise<any> {
    const { email, password } = command;
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    this.logger.log({
      message: `로그인 ${user}`,
    });
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

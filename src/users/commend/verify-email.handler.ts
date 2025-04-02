import { ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import {
  Inject,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';

export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_REPOSITORY_PROXY')
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    this.logger.log(user);
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

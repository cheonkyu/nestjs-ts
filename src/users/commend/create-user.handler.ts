import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { Count, Email, Id, Name, Password, Token } from 'src/types/user-type';
import { UserEntity } from 'src/entity/user.entity';
import { CreateUserCommand } from './create-user.command';
import { CreatedUserEvent } from '../event/created-user.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('USER_REPOSITORY_PROXY')
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1() as Token;
    await this.saveUser(name, email, password, signupVerifyToken);
    const event = new CreatedUserEvent(email, signupVerifyToken);
    this.eventBus.publish(event);
    return 'This action adds a new user';
  }

  private async checkUserExists(email: Email) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user != null;
  }

  private async saveUser(
    name: Name,
    email: Email,
    password: Password,
    signupVerifyToken: Token,
  ) {
    const user = new UserEntity();
    user.id = uuid.v1() as Id;
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    user.count = 1 as Count;
    this.logger.log(user);
    return this.usersRepository.save(user);
  }
}

import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '@/email/email.service';
import { Count, Email, Id, Name, Password, Token } from '@/types/user-type';
// import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    // @InjectRepository(UserEntity)
    @Inject('USER_REPOSITORY_PROXY')
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Transactional()
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1() as Token;
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
    return 'This action adds a new user';
  }

  async checkUserExists(email: Email) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user != null;
  }

  async saveUser(
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
    this.logger.log(user);
    return this.usersRepository.save(user);
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

  async verifyEmail(signupVerifyToken: Token) {
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

  async login(email: Email, password: Password) {
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

  async getUserInfo(userId: Id) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    user.count = (Number(user.count ?? 0) + 1) as Count;
    await this.usersRepository.save(user);
    this.logger.error(user);
    return user;
  }
}

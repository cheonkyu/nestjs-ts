import {
  Inject,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '@/users/entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserInfoQuery } from './get-user-info.query';
import { Count } from '@/types/user-type';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHander implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @Inject('USER_REPOSITORY_PROXY')
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<any> {
    const { userId } = query;

    const user = await this.usersRepository.findOne({
      where: { id: userId } as any,
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

import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailModule } from '@/email/email.module';
import { UsersController } from './users.controller';
import { UserEntity } from '@/users/entity/user.entity';
import { DataSource } from 'typeorm';
import { createRepositoryProxy } from '@/helper/typeorm/RepositoryProxy';
import { CreateUserHandler } from './commend/create-user.handler';
import { GetUserInfoQueryHander } from './query/get-user-info.handler';
import { UserEventHandler } from './event/user-event.handler';
import { AuthModule } from '@/auth/auth.module';

const commandHandlers = [CreateUserHandler];
const queryHandlers = [GetUserInfoQueryHander];
const eventHandlers = [UserEventHandler];
@Module({
  imports: [
    AuthModule,
    CqrsModule,
    EmailModule,
    // , TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UsersController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    Logger,
    // TODO: Dynamic 모듈 활용 주입
    // https://github.com/nestjs/typeorm/blob/master/lib/typeorm.module.ts
    {
      provide: 'USER_REPOSITORY_PROXY',
      useFactory: (dataSource: DataSource) => {
        const repo = dataSource.getRepository(UserEntity);
        return createRepositoryProxy(repo);
      },
      inject: [DataSource],
    },
  ],
})
export class UsersModule {}

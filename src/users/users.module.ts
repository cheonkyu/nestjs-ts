import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { createRepositoryProxy } from 'src/helper/typeorm/RepositoryProxy';

@Module({
  imports: [
    EmailModule,
    // , TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
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

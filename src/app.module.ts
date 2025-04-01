import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

console.log(`__dirname: ${__dirname}`);
console.log(`${__dirname}/config/env/.${process.env.NODE_ENV}.env`)

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    UsersModule,
    EmailModule,
  ],
  providers: [EmailService],
})
export class AppModule {}

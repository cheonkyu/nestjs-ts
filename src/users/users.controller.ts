import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Id } from 'src/types/user-type';
import { AuthGuard } from 'src/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commend/create-user.command';
import { VerifyEmailCommand } from './commend/verify-email.command';
import { GetUserInfoQuery } from './query/get-user-info.query';
import { LoginCommand } from './commend/login.command';

@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @HttpCode(201)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const { name, email, password } = dto;

    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Get('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    const { signupVerifyToken } = dto;
    const command = new VerifyEmailCommand(signupVerifyToken);
    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto) {
    const { email, password } = dto;
    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    const getUserInfoQuery = new GetUserInfoQuery(userId as Id);
    return this.queryBus.execute(getUserInfoQuery);
  }
}

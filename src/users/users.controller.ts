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
import { Id, Token } from 'src/types/user-type';
import { AuthGuard } from 'src/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(201)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    return this.usersService.verifyEmail(dto.signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto) {
    const { email, password } = dto;
    return this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    return this.usersService.getUserInfo(userId as Id);
  }
}

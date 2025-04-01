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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
    return this.usersService.verifyEmail(dto);
  }

  @Get('/login')
  async login(@Body() dto: UserLoginDto) {
    const { email, password } = dto;
    return this.usersService.login(email, password);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}

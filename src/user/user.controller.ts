import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/_authStrategies/jwtDecorator';
import { UserService } from './user.service';
import { loginDto, registerDto } from './_dto/users.dto';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post('login')
  async login(@Body() body: loginDto) {
    return await this.usersService.login(body);
  }

  @Post('register')
  async register(@Body() body: registerDto) {
    return await this.usersService.register(body);
  }

  @Get('user-info')
  async userInfo(@User() user) {
    return user;
  }
}

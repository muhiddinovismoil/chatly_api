import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';

import { CurrentUser } from '@decorators';
import { ICurrentUser } from '@type';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('me')
  getProfile(@CurrentUser() user: ICurrentUser) {
    return this.userService.getMe(user);
  }

  @Get('search')
  searchUsers(@Query() username) {}
}

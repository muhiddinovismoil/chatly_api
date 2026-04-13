import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('me')
  getProfile(@) {
    // return this.userService
  }

  @Get('search')
  searchUsers(@Query() username) {}
}

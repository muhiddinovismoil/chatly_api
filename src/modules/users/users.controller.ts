import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  create() {}

  @Get()
  findAll() {}

  @Put('/:id')
  update() {}

  @Delete('/:id')
  delete() {}
}

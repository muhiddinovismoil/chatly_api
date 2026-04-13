import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('google')
export class NameController {
  @Post()
  create() {}
}

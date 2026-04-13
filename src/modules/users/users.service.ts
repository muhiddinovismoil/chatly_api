import { NotFoundException } from '@nestjs/common';

import { PrismaService } from '@prisma';
import { ICurrentUser } from '@type';
import { ServiceExceptions } from '@utils';

export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe({ id }: ICurrentUser) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      ServiceExceptions.handle(error, UsersService.name, 'getMe');
    }
  }

  async getByUsername(username: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { username: { contains: username, mode: 'insensitive' } },
      });
      if (!users) throw new NotFoundException('User not found');
      return users;
    } catch (error) {
      ServiceExceptions.handle(error, UsersService.name, 'getByUsername');
    }
  }

  async create() {
    try {
    } catch (error) {
      ServiceExceptions.handle(error, UsersService.name, 'create');
    }
  }
}

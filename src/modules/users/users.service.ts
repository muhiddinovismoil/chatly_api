import { PrismaService } from '@prisma';
import { ICurrentUser } from '@type';

export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(user: ICurrentUser) {}
}

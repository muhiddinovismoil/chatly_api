import { Module } from '@nestjs/common';

import { PrismaModule } from '@prisma';
import { UsersModule } from 'modules/users';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

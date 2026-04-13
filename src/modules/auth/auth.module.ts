import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@prisma';
import { UsersModule } from 'modules/users';

import { AuthController } from './controllers';
import { AuthService } from './services';
import { GoogleStrategy } from './strategies';

@Module({
  imports: [JwtModule, PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}

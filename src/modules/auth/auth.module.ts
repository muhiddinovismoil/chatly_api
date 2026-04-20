import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@prisma';
import { UsersModule } from 'modules/users';
import { HandmadeModule } from 'services/handmade.module';

import { AuthController, OAuthController } from './controllers';
import { AuthService } from './services';
import { OAuthService } from './services/oauth.service';
import { GoogleStrategy } from './strategies';

@Module({
  imports: [PrismaModule, UsersModule, HandmadeModule],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, GoogleStrategy, OAuthService],
})
export class AuthModule {}

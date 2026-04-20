import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma';
import { HandMadeService } from 'services/handmade.service';

@Injectable()
export class OAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handmade: HandMadeService,
  ) {}
  async googleLogin(googleUser: any) {
    const user = await this.prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        google_id: googleUser.googleId,
      },
      create: {
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        google_id: googleUser.googleId,
        username: await this.handmade.generateUsername(googleUser.email),
        is_verified: true,
      },
    });

    const tokens = await this.handmade.getTokens(user);

    return { user, ...tokens };
  }
}

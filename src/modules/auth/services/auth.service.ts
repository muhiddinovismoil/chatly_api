import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateUsername(email: string): Promise<string> {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'user';
    const existing = await this.prisma.user.findMany({
      where: {
        username: {
          in: await this.getCandidates(baseUsername, 10),
        },
      },
      select: { username: true },
    });
    if (!existing.some((u) => u.username === baseUsername)) {
      return baseUsername;
    }
    const takenSet = new Set(existing.map((u) => u.username));
    for (let i = 1; i <= 10; i++) {
      const candidate = `${baseUsername}${i}`;
      if (!takenSet.has(candidate)) return candidate;
    }
    return `${baseUsername}_${Date.now().toString(36)}`;
  }

  private getCandidates(base: string, count: number): string[] {
    return [base, ...Array.from({ length: count }, (_, i) => `${base}${i + 1}`)];
  }

  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          google_id: googleUser.googleId,
          username: await this.generateUsername(googleUser.email),
          is_verified: true,
        },
      });
    }

    if (!user.google_id) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { google_id: googleUser.googleId },
      });
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

    return { user, accessToken, refreshToken };
  }
}

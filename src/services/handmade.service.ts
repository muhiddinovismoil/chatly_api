import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@prisma';
import { User } from '@prisma/client';
import { ServiceExceptions } from '@utils';

@Injectable()
export class HandMadeService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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

  async getTokens(user: User) {
    try {
      const token1 = await this.config.get<string>('jwt.jwtAccessExpiresIn');
      console.log(typeof token1);
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { id: user.id },
          {
            secret: this.config.get<string>('jwt.jwtAccessSecretKey').trim()!,
            expiresIn: this.config.get<string>('jwt.jwtAccessExpiresIn').trim()! as any,
          },
        ),
        this.jwtService.signAsync(
          { id: user.id },
          {
            secret: this.config.get<string>('jwt.jwtRefreshSecretKey').trim()!,
            expiresIn: this.config.get<string>('jwt.jwtRefreshExpiresIn').trim()! as any,
          },
        ),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      ServiceExceptions.handle(error, HandMadeService.name, 'getTokens');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@prisma';
import { ServiceExceptions } from '@utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

  async login(payload) {}

  async signup(payload) {}
}

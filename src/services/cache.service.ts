import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { Cache } from 'cache-manager';
import * as crypto from 'node:crypto';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl: number = 100): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async sendOtp(): Promise<{ keyHash: string; otp: string }> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hex = crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(hex).digest('hex');
    const data = { otp, try: 5 };
    await this.set(keyHash, JSON.stringify(data));
    return { keyHash, otp };
  }

  async verifyOTP(key: string, otpCode: string): Promise<boolean> {
    const otpData = await this.get<string>(key);
    if (!otpData) {
      throw new BadRequestException('OTP incorrect or expired');
    }
    const { otp, try: remainingAttemptsOriginal } = JSON.parse(otpData);
    let remainingAttempts = remainingAttemptsOriginal;
    if (otp !== otpCode) {
      remainingAttempts -= 1;
      if (remainingAttempts <= 0) {
        await this.del(key);
        throw new BadRequestException(
          'You have exceeded the maximum number of attempts. Please request a new OTP.',
        );
      }
      const updatedData = JSON.stringify({ otp, try: remainingAttempts });
      await this.set(key, updatedData);
      throw new BadRequestException(`OTP incorrect`);
    }
    return true;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const store = this.cacheManager.stores as any;

    const keys: string[] = store.keys ? await store.keys() : [];

    const filteredKeys = keys.filter((key) => key.includes(pattern));

    await Promise.all(filteredKeys.map((key) => this.cacheManager.del(key)));
  }
}

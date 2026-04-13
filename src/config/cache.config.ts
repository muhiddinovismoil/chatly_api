import { registerAs } from '@nestjs/config';

export interface CacheConfigOptions {
  host: string;
  port: number;
}

export const cacheConfig = registerAs<CacheConfigOptions>(
  'redis',
  (): CacheConfigOptions => ({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  }),
);

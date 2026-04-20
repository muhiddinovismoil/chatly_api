import { registerAs } from '@nestjs/config';

export interface JwtConfigOptions {
  jwtAccessSecretKey: string;
  jwtAccessExpiresIn: string;
  jwtRefreshSecretKey: string;
  jwtRefreshExpiresIn: string;
}

export const jwtConfig = registerAs<JwtConfigOptions>(
  'jwt',
  (): JwtConfigOptions => ({
    jwtAccessSecretKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    jwtRefreshSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET,
  }),
);

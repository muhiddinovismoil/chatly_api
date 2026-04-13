import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { appConfig, cacheConfig, CacheConfigOptions, databaseConfig } from '@config';
import { AuthModule, UsersModule } from '@modules';
import { PrismaModule } from '@prisma';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, cacheConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<CacheConfigOptions>('redis');

        const store = await redisStore({
          socket: {
            host: config.host,
            port: config.port,
            reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
          },
        });

        return {
          store,
          ttl: 60 * 60 * 24,
        };
      },
      inject: [ConfigService],
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}

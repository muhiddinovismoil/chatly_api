import { appConfig, databaseConfig } from '@config';
import {
  AuthModule,
  ChatModule,
  FriendsModule,
  MessagesModule,
  UsersModule,
} from '@modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),

    AuthModule,
    UsersModule,
    ChatModule,
    FriendsModule,
    MessagesModule,
  ],
  providers: [],
})
export class AppModule {}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake?.auth?.token || client.handshake?.query?.token;

    if (!token) {
      throw new WsException('Token not found');
    }
    const secret = this.config.get('jwt.jwtAccessSecretKey');

    try {
      const payload = this.jwtService.verify(token, { secret });
      client.user = payload;
      return true;
    } catch (e) {
      throw new WsException(e.message || 'Invalid token');
    }
  }
}

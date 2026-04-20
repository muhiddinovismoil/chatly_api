import { Controller, Post } from '@nestjs/common';

@Controller('auth/twofa')
export class TwoFaController {
  @Post('enable')
  enableTwoFactorAuth() {}

  @Post('disable')
  disableTwoFactorAuth() {}
}

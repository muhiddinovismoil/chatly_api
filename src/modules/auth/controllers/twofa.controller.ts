import { Controller, Post } from '@nestjs/common';

@Controller('twofa')
export class TwoFaController {
  @Post('enable')
  enableTwoFactorAuth() {}

  @Post('disable')
  disableTwoFactorAuth() {}
}

import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup() {}

  @Post('signin')
  signin() {}

  @Post('google')
  googleAuth() {}

  @Post('otp/verify')
  verifyOtp() {}

  @Post('otp/resend')
  resendOtp() {}

  @Post('2fa/enable')
  enableTwoFactorAuth() {}

  @Post('2fa/disable')
  disableTwoFactorAuth() {}
}

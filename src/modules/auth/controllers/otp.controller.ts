import { Controller, Post } from '@nestjs/common';

@Controller('auth/otp')
export class OtpController {
  @Post('verify')
  verifyOtp() {}

  @Post('resend')
  resendOtp() {}
}

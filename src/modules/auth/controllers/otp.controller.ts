import { Controller, Post } from '@nestjs/common';

@Controller('otp')
export class OtpController {
  @Post('verify')
  verifyOtp() {}

  @Post('resend')
  resendOtp() {}
}

import { Controller } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { OnEvent } from '@nestjs/event-emitter';
import { RESET_PASSWORD, VERIFICATION_CODE } from '@app/common';

@Controller()
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @OnEvent(VERIFICATION_CODE)
  async sendVerificationEmail(data: any): Promise<void> {
    await this.mailingService.sendVerificationCode(data);
  }

  @OnEvent(RESET_PASSWORD)
  async sendResetPasswordEmail(data: any): Promise<void> {
    await this.mailingService.sendResetPassword(data);
  }
}

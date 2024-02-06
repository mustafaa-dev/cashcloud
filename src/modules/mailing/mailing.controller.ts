import { Controller } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RESET_PASSWORD, VERIFICATION_CODE } from '@app/common';

@Controller()
export class MailingController {
  constructor(
    private readonly mailingService: MailingService,
    private readonly ee: EventEmitter2,
  ) {}

  @OnEvent(VERIFICATION_CODE)
  async sendVerificationEmail(data: any) {
    await this.mailingService.sendVerificationCode(data);
  }

  @OnEvent(RESET_PASSWORD)
  async sendResetPasswordEmail(data: any) {
    await this.mailingService.sendResetPassword(data);
  }
}

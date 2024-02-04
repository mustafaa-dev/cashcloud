import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail = require('@sendgrid/mail');

@Injectable()
export class MailingService {
  constructor(private readonly configService: ConfigService) {}

  async sendVerificationCode(data: any) {
    return await this.sendEmail(
      data.email,
      'Verification Code',
      data.code.toString(),
    );
  }

  async sendEmail(to: any, subject: string, text: any) {
    const SENDGRID_API_KEY = this.configService.get('SENDGRID_API_KEY');
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to,
      from: 'mostafa.mohammed1235@gmail.com',
      subject,
      text,
    };
    await sgMail.send(msg);
  }
}

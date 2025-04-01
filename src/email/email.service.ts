import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

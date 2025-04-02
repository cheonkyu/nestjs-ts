import { IEventHandler } from '@nestjs/cqrs';
import { CreatedUserEvent } from './created-user.event';
import { EmailService } from '@/email/email.service';

export class UserEventHandler implements IEventHandler<CreatedUserEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: CreatedUserEvent) {
    switch (event.name) {
      case CreatedUserEvent.name:
        const { email, signupVerifyToken } = event;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      default:
        break;
    }
  }
}

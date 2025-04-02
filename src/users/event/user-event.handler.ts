import { IEventHandler } from '@nestjs/cqrs';
import { CreatedUserEvent } from './created-user.event';
import { EmailService } from '@/email/email.service';
import { UpdatedUserEvent } from './updated-user.event';
import { DeletedUserEvent } from './\bdeleted-user.event';

type UserEvent = CreatedUserEvent | UpdatedUserEvent | DeletedUserEvent;
export class UserEventHandler implements IEventHandler<UserEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserEvent) {
    if (event instanceof CreatedUserEvent) {
      const { email, signupVerifyToken } = event;
      await this.emailService.sendMemberJoinVerification(
        email,
        signupVerifyToken,
      );
    } else if (event instanceof UpdatedUserEvent) {
      // UpdatedUserEvent 처리 로직 추가
    } else if (event instanceof DeletedUserEvent) {
      // DeletedUserEvent 처리 로직 추가
    } else {
      // assertNever 함수를 이용해 완전 검사하기
      throw this.assertNever(event);
    }
  }

  private assertNever(value: never) {
    throw Error('value를 확인해보세요.');
  }
}

import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class UpdatedUserEvent extends CqrsEvent implements IEvent {
  constructor(readonly email: string, readonly signupVerifyToken: string) {
    super(UpdatedUserEvent.name);
  }
}

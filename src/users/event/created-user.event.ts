import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class CreatedUserEvent extends CqrsEvent implements IEvent {
  constructor(readonly email: string, readonly signupVerifyToken: string) {
    super(CreatedUserEvent.name);
  }
}

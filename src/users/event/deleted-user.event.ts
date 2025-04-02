import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class DeletedUserEvent extends CqrsEvent implements IEvent {
  constructor() {
    super(DeletedUserEvent.name);
  }
}

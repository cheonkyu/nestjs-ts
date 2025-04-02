import { DomainColumn } from '@/helper/typeorm/DomainColumn';
import { Count, Email, Id, Name, Password, Token } from '@/types/user-type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @DomainColumn<Id>(PrimaryColumn, {
    name: 'id',
    type: 'varchar',
  })
  id: Id;

  @DomainColumn<Name>(Column, {
    name: 'name',
    type: 'varchar',
    length: 20,
  })
  name: Name;

  @DomainColumn<Email>(Column, {
    name: 'email',
    type: 'varchar',
    length: 60,
  })
  email: Email;

  @DomainColumn<Password>(Column, {
    name: 'password',
    type: 'varchar',
    length: 60,
  })
  password: Password;

  @DomainColumn<Token>(Column, {
    name: 'token',
    type: 'varchar',
    length: 60,
  })
  signupVerifyToken: Token;

  @DomainColumn<Count>(Column, {
    name: 'count',
    type: 'int',
  })
  count: Count;

  toJSON() {
    const result = {};
    Object.keys(this).forEach((key: string) => {
      result[key] = this[key];
    });
    return result;
  }
}

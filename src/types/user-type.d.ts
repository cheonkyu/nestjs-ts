type Brand<K, T> = K & { __brand: T };
export type Id = Brand<string, 'id'>;
export type Name = Brand<string, 'name'>;
export type Email = Brand<string, 'email'>;
export type Token = Brand<string, 'token'>;
export type Password = Brand<string, 'password'>;
export type Count = Brand<number, 'number'>;

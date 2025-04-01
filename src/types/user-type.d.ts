type Brand<K, T> = K & { __brand: T };
export type Name = Brand<string, 'name'>;
export type Email = Brand<string, 'email'>;
export type Token = Brand<string, 'token'>;
export type Password = Brand<string, 'password'>;

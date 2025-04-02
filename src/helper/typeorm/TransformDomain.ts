// import { FindOptionsWhere } from 'typeorm';

// type AddUnderscore<T> = {
//   [K in keyof T as `_${K & string}`]: T[K];
// } | T;

// export function transformDomain<T extends Record<string, any>, Entity>(
//   obj: T,
// ): FindOptionsWhere<AddUnderscore<T> & Entity> {
//   const result = {} as Partial<AddUnderscore<T>>;

//   Object.keys(obj).forEach((key: keyof T & string) => {
//     const newKey = `_${key}` as keyof AddUnderscore<T>;
//     result[newKey] = obj[key]; // 타입 캐스팅을 통해 정확한 매칭 수행
//   });

//   return result as FindOptionsWhere<AddUnderscore<T> & Entity>;
// }

// export function restoreDomain<T extends Record<string, any>>(
//   obj: AddUnderscore<T>,
// ): T {
//   const result = {} as Partial<T>;

//   Object.keys(obj).forEach((key: keyof T & string) => {
//     const originalKey = (key.startsWith('_') ? key.slice(1) : key) as keyof T;
//     result[originalKey] = obj[key as any];
//   });
//   return result as T;
// }

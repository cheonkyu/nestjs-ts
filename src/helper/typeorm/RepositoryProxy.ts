import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export function createRepositoryProxy<T extends ObjectLiteral>(
  repository: Repository<T>,
): Repository<T> {
  return new Proxy(repository, {
    get(target, prop: keyof Repository<T>) {
      const original = target[prop];

      if (typeof original === 'function') {
        return async function (...args: any[]) {
          if (prop.indexOf('find') >= 0) {
            // 조회 메서드에 where 내 프로퍼티를 '_'를 앞에 붙임
            if (Array.isArray(args)) {
              args[0].where = transformDomain(args[0]?.where);
            }
          }
          const rawEntity = await original.apply(target, args);
          if (Array.isArray(rawEntity)) {
            const result = rawEntity.map((el) => restoreDomain(el));
            return result;
          } else if (rawEntity) {
            const result = restoreDomain(rawEntity);
            return result;
          } else {
            return rawEntity;
          }
        };
      }

      return original;
    },
  });
}

type AddUnderscore<T> =
  | {
      [K in keyof T as `_${K & string}`]: T[K];
    }
  | T;

function transformDomain<T extends Record<string, any>, Entity>(
  obj: T,
): FindOptionsWhere<AddUnderscore<T> & Entity> {
  const result = {} as Partial<AddUnderscore<T>>;

  Object.keys(obj).forEach((key: keyof T & string) => {
    const newKey = `_${key}` as keyof AddUnderscore<T>;
    result[newKey] = obj[key]; // 타입 캐스팅을 통해 정확한 매칭 수행
  });

  return result as FindOptionsWhere<AddUnderscore<T> & Entity>;
}

function restoreDomain<T extends Record<string, any>>(
  obj: AddUnderscore<T>,
): T {
  const result = {} as Partial<T>;

  Object.keys(obj).forEach((key: keyof T & string) => {
    const originalKey = (key.startsWith('_') ? key.slice(1) : key) as keyof T;
    result[originalKey] = obj[key as any];
    Object.defineProperty(obj, originalKey, {
      value: obj[key as any],
      writable: true,
      enumerable: true,
      configurable: true,
    });
    delete obj[key as any];
  });

  // 기존의 객체(result)를 원본 엔티티 타입의 인스턴스로 변환
  if ('constructor' in obj && typeof obj.constructor === 'function') {
    const typeormEntity = Object.assign(
      new (obj.constructor as { new (): T })(),
      result,
    );
    return typeormEntity;
  }

  return result as T;
}

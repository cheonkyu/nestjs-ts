import { Column, PrimaryColumn } from 'typeorm';

// 브랜드 타입 적용하는 헬퍼 데코레이터
// TODO: 보다 이쁘게 정의하기
export function DomainColumn<T>(
  column: typeof Column | typeof PrimaryColumn,
  options?: any,
) {
  return function (target: any, propertyKey: string) {
    if (typeof column === 'function') {
      column({ ...options })(target, `_${propertyKey}`);
    }

    Object.defineProperty(target, propertyKey, {
      get() {
        return this[`_${propertyKey}`] as T;
      },
      set(value: T) {
        this[`_${propertyKey}`] = value;
      },
    });
  };
}

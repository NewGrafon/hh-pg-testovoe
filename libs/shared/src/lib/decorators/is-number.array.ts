import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsNumberArray(validationOptions?: ValidationOptions & { min?: number, max?: number }) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'NumberArrayDecorator',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: Object.assign({
        message: 'В массиве тегов находятся не числовые значения или некоторые значения равны или ниже нуля!'
      }, validationOptions || {}),
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            validationOptions?.min !== undefined && validationOptions?.max !== undefined
            && validationOptions.min > validationOptions.max
          ) {
            validationOptions.min = validationOptions.max;
          }
          return Array.isArray(value)
            && value.filter((num) =>
              typeof num === 'number'
              && (validationOptions?.min !== undefined ? num >= validationOptions.min : true)
              && (validationOptions?.max !== undefined ? num <= validationOptions.max : true)
            ).length === value.length;
        }
      }
    });
  };
}

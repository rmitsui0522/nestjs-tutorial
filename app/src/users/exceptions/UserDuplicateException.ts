import { InternalServerErrorException } from '@nestjs/common';

export class UserDuplicateException extends InternalServerErrorException {
  constructor(fieldName: string) {
    super(
      `Duplicated '${fieldName}' error. Record '${fieldName}' must be unique.`,
    );
  }
}

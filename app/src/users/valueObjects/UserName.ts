import { InternalServerErrorException } from '@nestjs/common';
import { IValueObject } from '../../interface/valuObject.interface';

export class UserName implements IValueObject {
  private _userName: string;

  constructor(userName: string) {
    if (userName.length < 8) {
      throw new InternalServerErrorException(
        'ユーザー名は8文字以上である必要があります',
      );
    }

    this._userName = userName;
  }

  public value(): string {
    return this._userName;
  }
}

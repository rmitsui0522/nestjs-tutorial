import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IValueObject } from '../../interface/valuObject.inyerface';

export class Password implements IValueObject {
  // private _plainTextPassword: string;
  private _hashedPassword: string;
  private _saltOrRounds: number = 10;

  constructor(plainTextPassword: string) {
    if (plainTextPassword.length < 8) {
      throw new InternalServerErrorException(
        'パスワードは8文字以上である必要があります',
      );
    }

    // this._plainTextPassword = plainTextPassword;
    this._hashedPassword = bcrypt.hashSync(
      plainTextPassword,
      this._saltOrRounds,
    );
  }

  public value(): string {
    return this._hashedPassword;
  }

  // public hashValue(): Promise<string> {
  //   return bcrypt.hash(this._plainTextPassword, this._saltOrRounds);
  // }

  public static compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  }
}

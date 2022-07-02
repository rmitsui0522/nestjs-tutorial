import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export class Password {
  private _plainTextPassword: string;
  private _saltOrRounds: number = 10;

  constructor(plainTextPassword: string) {
    if (plainTextPassword.length < 8) {
      throw new InternalServerErrorException(
        'パスワードは8文字以上である必要があります',
      );
    }

    this._plainTextPassword = plainTextPassword;
  }

  public hashValue(): Promise<string> {
    return bcrypt.hash(this._plainTextPassword, this._saltOrRounds);
  }

  public compare(hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this._plainTextPassword, hashedPassword);
  }
}

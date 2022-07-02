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

  public async hashValue(): Promise<string> {
    return await bcrypt.hash(this._plainTextPassword, this._saltOrRounds);
  }

  public static async compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

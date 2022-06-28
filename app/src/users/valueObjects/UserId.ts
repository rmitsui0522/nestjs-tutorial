import { InternalServerErrorException } from '@nestjs/common';

export class UserId {
  private readonly _userId: string;

  constructor(userId: string) {
    if (userId.length < 8) {
      throw new InternalServerErrorException(
        'ユーザーIDは8文字以上である必要があります',
      );
    }

    this._userId = userId;
  }

  public value(): string {
    return this._userId;
  }
}

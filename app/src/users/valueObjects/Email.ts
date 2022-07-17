import { IValueObject } from '../../interface/valuObject.interface';

export class Email implements IValueObject {
  private _email: string;

  constructor(email: string) {
    // TODO: null, undefined のエラーハンドリング
    // TODO: フォーマットチェック
    this._email = email;
  }

  public value(): string {
    return this._email;
  }
}

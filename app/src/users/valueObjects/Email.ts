import { IValueObject } from '../../interface/valuObject.interface';

export class Email implements IValueObject {
  private _email: string;

  constructor(email: string) {
    this._email = email;
  }

  public value(): string {
    return this._email;
  }
}

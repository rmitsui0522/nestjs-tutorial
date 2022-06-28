export class Email {
  private readonly _email: string;

  constructor(email: string) {
    this._email = email;
  }

  public value(): string {
    return this._email;
  }
}

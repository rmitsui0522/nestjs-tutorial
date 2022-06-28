export class NickName {
  private readonly _nickname: string;

  constructor(nickname: string) {
    this._nickname = nickname;
  }

  public value(): string {
    return this._nickname;
  }
}

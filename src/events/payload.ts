export default class Payload {
  private _id: string;
  private _callback: any;

  constructor(id: string, callback: any) {
    this._id = id;
    this._callback = callback;
  }

  id(): string {
    return this._id;
  }

  callback(): any {
    return this._callback;
  }
}

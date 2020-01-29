export default class Payload {
  private name: string;
  private callback: any;

  constructor(id: string, callback: any) {
    this.name = id;
    this.callback = callback;
  }

  id(): string {
    return this.name;
  }

  resolver(): any {
    return this.callback;
  }
}

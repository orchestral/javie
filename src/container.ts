let isFunction = require('lodash').isFunction;

export default class Container {
  private name: string;
  private instance: any;
  private _shared: boolean = false;
  private _resolved: boolean = false;

  constructor(name: string, instance: any, shared: boolean = false, resolved: boolean = false) {
    this.name = name;
    this.instance = instance;
    this._shared = shared;
    this._resolved = resolved;
  }

  resolving(options: any = []): any {
    if (this._shared && this._resolved) {
      return this.instance;
    }

    let resolved = this.instance;

    if (isFunction(resolved)) {
      resolved = resolved.apply(this, options);
    }

    if (this._shared) {
      this.instance = resolved;
      this._resolved = true;
    }

    return resolved;
  }

  resolved(): boolean {
    return this._resolved;
  }

  shared(): boolean {
    return this._shared;
  }
}


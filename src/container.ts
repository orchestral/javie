let isFunction = require('lodash').isFunction;

export default class Container {
  private name: string;
  private instance: any;
  private isShared: boolean = false;
  private isResolved: boolean = false;

  constructor(name: string, instance: any, shared: boolean = false, resolved: boolean = false) {
    this.name = name;
    this.instance = instance;
    this.isShared = shared;
    this.isResolved = resolved;
  }

  alias(): string {
    return this.name;
  }

  resolving(options: any = []): any {
    if (this.isShared && this.isResolved) {
      return this.instance;
    }

    let resolved = this.instance;

    if (isFunction(resolved)) {
      resolved = resolved.apply(this, options);
    }

    if (this.isShared) {
      this.instance = resolved;
      this.isResolved = true;
    }

    return resolved;
  }

  resolved(): boolean {
    return this.isResolved;
  }

  shared(): boolean {
    return this.isShared;
  }
}


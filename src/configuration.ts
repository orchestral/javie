let defaults = require('lodash').defaults;
let isObject = require('lodash').isObject;
let isUndefined = require('lodash').isUndefined;

export default class Configuration {
  private attributes: any = {};

  constructor(attributes: any = {}) {
    this.attributes = attributes;
  }

  has(key: string): boolean {
    return !isUndefined(this.attributes[key]);
  }

  get(key: string, defaults: any = null): any {
    return this.has(key) ? this.attributes[key] : defaults;
  }

  put(key: any, value: any): void {
    let config = key;

    if (!isObject(key)) {
      config = {};
      config[key] = value;
    }

    this.attributes = defaults(config, this.attributes);
  }

  all(): any {
    return this.attributes;
  }
}

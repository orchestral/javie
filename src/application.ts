import Container from './container';
import Configuration from './configuration';
import Events from './events';

let isFunction = require('lodash').isFunction;

let setup = function (app: Application) {
  app.singleton('event', () => new Events());
};

export default class Application {
  private config: Configuration;
  private environment: string;
  private instances: any = {};

  constructor(environment: string = 'production') {
    this.config = new Configuration({});
    this.environment = environment;

    setup(this);
  }

  detectEnvironment(environment: any): string {
    if (isFunction(environment)) {
      environment = environment.apply(this);
    }

    return this.environment = environment;
  }

  env(): string {
    return this.environment;
  }

  get(key: string, defaults: any = null): any {
    return this.config.get(key, defaults);
  }

  put(key: string, value: any): Application {
    this.config.put(key, value);

    return this;
  }

  on(name: string, callback: any): Application {
    this.make('event').listen(name, callback);

    return this
  }

  emit(name: string, options: any = []): Application {
    this.make('event').emit(name, options);

    return this;
  }

  bind(name: string, instance: any): Application {
    this.instances[name] = new Container(name, instance);

    return this;
  }

  singleton(name: string, instance: any): Application {
    this.instances[name] = new Container(name, instance, true);

    return this;
  }

  make(name: string): any {
    let options = Array.prototype.slice.call(arguments);
    name = options.shift();

    if (this.instances[name] instanceof Container) {
      return this.instances[name].resolving(options);
    }
  }

  when(environment: string, callback: any): any {
    let env = this.environment;

    if (env === environment || environment == '*') {
      return this.run(callback);
    }
  }

  run(callback: any): any {
    if (isFunction(callback)) {
      return callback.call(this);
    }
  }
}

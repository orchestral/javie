import Collector from './profilers/collector';

let profilers: any = {};
let logging: boolean = false;

export default class Profiler {
  constructor(name: string) {
    return Profiler.make(name);
  }

  static make(name: string = 'default') {
    if (profilers[name] == null)
      profilers[name] = new Collector(name, logging)

    return profilers[name]
  }

  static enable(): void {
    logging = true;
  }

  static disable(): void {
    logging = false;
  }
}
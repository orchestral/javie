import Dispatcher from './events/dispatcher';

let instance = new Dispatcher();

export default class Events {
  constructor() {
    return Events.make();
  }

  static make() {
    return instance;
  }
}

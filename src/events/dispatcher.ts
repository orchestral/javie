import Payload from './payload';

let clone = require('lodash').clone;
let each = require('lodash').each;
let isArray = require('lodash').isArray;
let isNull = require('lodash').isNull;
let isFunction = require('lodash').isFunction;

let events: any = {};

export default class Dispatcher {
  clone(id: string): any {
    return {
      to: (to: string) => {
        return events[to] = clone(events[id]);
      },
    };
  }

  listen(id: string, callback: any): Payload {
    if (!isFunction(callback)) {
      throw new Error("Callback is not a function.");
    }

    let payload = new Payload(id, callback);

    if (!isArray(events[id])) {
      events[id] = [];
    }

    events[id].push(callback);

    return payload;
  }

  emit(id: string, options: any = []): any {
    if (id == null) {
      throw new Error(`Event ID [${id}] is not available.`);
    }

    return this.dispatch(events[id], options);
  }

  first(id: string, options: any): any {
    if (id == null) {
      throw new Error(`Event ID [${id}] is not available.`);
    }

    let event = events[id].slice(0, 1);
    let responses = this.dispatch(event, options);

    return responses.shift();
  }

  until(id: string, options: any): any {
    if (id == null) {
      throw new Error(`Event ID [${id}] is not available.`);
    }

    let responses = this.dispatch(events[id], options, true);

    return responses.length < 1 ? null : responses.shift();
  }

  flush(id: string) {
    if (!isNull(events[id])) {
      events[id] = null;
    }
  }

  forget(payload: Payload): void {
    let id = payload.id();

    if (!isArray(events[id])) {
      throw new Error(`Event ID [${id}] is not available.`);
    }

    each(events[id], (callback: any, key: any) => {
      if (payload.resolver() == callback) {
        events[id].splice(key, 1);
      }
    })
  }

  dispatch(queued: any, options: any = [], halt: boolean = false): any {
    let responses: any = [];

    if (!isArray(queued)) {
      return null;
    }

    each(queued, (callback: any, key: any) => {
      if (halt == false || responses.length == 0) {
        let response = callback.apply(this, options);

        responses.push(response);
      }
    })

    return responses;
  }
}

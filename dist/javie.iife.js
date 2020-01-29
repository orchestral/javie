var Javie = (function () {
  'use strict';

  let isFunction = require('lodash').isFunction;
  class Container {
      constructor(name, instance, shared = false, resolved = false) {
          this._shared = false;
          this._resolved = false;
          this.name = name;
          this.instance = instance;
          this._shared = shared;
          this._resolved = resolved;
      }
      resolving(options = []) {
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
      resolved() {
          return this._resolved;
      }
      shared() {
          return this._shared;
      }
  }

  let defaults = require('lodash').defaults;
  let isObject = require('lodash').isObject;
  let isUndefined = require('lodash').isUndefined;
  class Configuration {
      constructor(attributes = {}) {
          this.attributes = {};
          this.attributes = attributes;
      }
      has(key) {
          return !isUndefined(this.attributes[key]);
      }
      get(key, defaults = null) {
          return this.has(key) ? this.attributes[key] : defaults;
      }
      put(key, value) {
          let config = key;
          if (!isObject(key)) {
              config = {};
              config[key] = value;
          }
          this.attributes = defaults(config, this.attributes);
      }
      all() {
          return this.attributes;
      }
  }

  class Payload {
      constructor(id, callback) {
          this._id = id;
          this._callback = callback;
      }
      id() {
          return this._id;
      }
      callback() {
          return this._callback;
      }
  }

  let clone = require('lodash').clone;
  let each = require('lodash').each;
  let isArray = require('lodash').isArray;
  let isNull = require('lodash').isNull;
  let isFunction$1 = require('lodash').isFunction;
  let events = {};
  class Dispatcher {
      clone(id) {
          return {
              to: (to) => {
                  return events[to] = clone(events[id]);
              },
          };
      }
      listen(id, callback) {
          if (!isFunction$1(callback)) {
              throw new Error("Callback is not a function.");
          }
          let payload = new Payload(id, callback);
          if (!isArray(events[id])) {
              events[id] = [];
          }
          events[id].push(callback);
          return payload;
      }
      fire(id, options = []) {
          if (id == null) {
              throw new Error(`Event ID [${id}] is not available.`);
          }
          return this.dispatch(events[id], options);
      }
      first(id, options) {
          if (id == null) {
              throw new Error(`Event ID [${id}] is not available.`);
          }
          let event = events[id].slice(0, 1);
          let responses = this.dispatch(event, options);
          return responses.shift();
      }
      until(id, options) {
          if (id == null) {
              throw new Error(`Event ID [${id}] is not available.`);
          }
          let responses = this.dispatch(events[id], options, true);
          return responses.length < 1 ? null : responses.shift();
      }
      flush(id) {
          if (!isNull(events[id])) {
              events[id] = null;
          }
      }
      forget(payload) {
          let id = payload.id();
          if (!isArray(events[id])) {
              throw new Error(`Event ID [${id}] is not available.`);
          }
          each(events[id], (callback, key) => {
              if (payload.callback() == callback) {
                  events[id].splice(key, 1);
              }
          });
      }
      dispatch(queued, options = [], halt = false) {
          let responses = [];
          if (!isArray(queued)) {
              return null;
          }
          each(queued, (callback, key) => {
              if (halt == false || responses.length == 0) {
                  let response = callback.apply(this, options);
                  responses.push(response);
              }
          });
          return responses;
      }
  }

  let isFunction$2 = require('lodash').isFunction;
  let setup = function (app) {
      app.singleton('event', () => new Dispatcher());
  };
  class Application {
      constructor(environment = 'production') {
          this.instances = {};
          this.config = new Configuration({});
          this.environment = environment;
          setup(this);
      }
      detectEnvironment(environment) {
          if (isFunction$2(environment)) {
              environment = environment.apply(this);
          }
          return this.environment = environment;
      }
      env() {
          return this.environment;
      }
      get(key, defaults = null) {
          return this.config.get(key, defaults);
      }
      put(key, value) {
          this.config.put(key, value);
          return this;
      }
      on(name, callback) {
          this.make('event').listen(name, callback);
          return this;
      }
      emit(name, options = []) {
          this.make('event').emit(name, options);
          return this;
      }
      bind(name, instance) {
          this.instances[name] = new Container(name, instance);
          return this;
      }
      singleton(name, instance) {
          this.instances[name] = new Container(name, instance, true);
          return this;
      }
      make(name) {
          let options = Array.prototype.slice.call(arguments);
          name = options.shift();
          if (this.instances[name] instanceof Container) {
              return this.instances[name].resolving(options);
          }
      }
      when(environment, callback) {
          let env = this.environment;
          if (env === environment || environment == '*') {
              return this.run(callback);
          }
      }
      run(callback) {
          if (isFunction$2(callback)) {
              return callback.call(this);
          }
      }
  }

  let Javie = new Application();
  Javie.bind('config', (attributes = {}) => {
      return new Configuration(attributes);
  });

  return Javie;

}());

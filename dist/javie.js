let isFunction = require('lodash').isFunction;
class Container {
    constructor(name, instance, shared = false, resolved = false) {
        this.isShared = false;
        this.isResolved = false;
        this.name = name;
        this.instance = instance;
        this.isShared = shared;
        this.isResolved = resolved;
    }
    alias() {
        return this.name;
    }
    resolving(options = []) {
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
    resolved() {
        return this.isResolved;
    }
    shared() {
        return this.isShared;
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
        this.name = id;
        this.callback = callback;
    }
    id() {
        return this.name;
    }
    resolver() {
        return this.callback;
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
    emit(id, options = []) {
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
            if (payload.resolver() == callback) {
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
let config = new Configuration();
let setup = function (app) {
    app.singleton('event', () => new Dispatcher());
};
class Application {
    constructor(environment = 'production') {
        this.instances = {};
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
        return config.get(key, defaults);
    }
    put(key, value) {
        config.put(key, value);
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

let microtime = function () {
    let time = new Date().getTime();
    return parseInt(`${(time / 1000)}`, 10);
};

class Entry {
    constructor(id, type, start = null) {
        this.start = null;
        this.end = null;
        this.total = null;
        this.message = '';
        if (start == null) {
            start = microtime();
        }
        this.id = id;
        this.type = type;
        this.start = start;
    }
}

class Collector {
    constructor(name, logging) {
        this.entries = [];
        this.pair = {};
        this.name = name;
        this.logging = logging;
        this.started = microtime();
    }
    id() {
        return this.name;
    }
    time(id, message) {
        if (!this.logging) {
            return null;
        }
        if (id == null) {
            id = this.entries.length;
        }
        let entry = new Entry(id, 'time');
        entry.message = message.toString();
        let key = this.pair[`time${id}`];
        if (typeof key != 'undefined') {
            this.entries[key] = entry;
        }
        else {
            this.entries.push(entry);
            this.pair[`time${id}`] = (this.entries.length - 1);
        }
        console.time(id);
        return id;
    }
    timeEnd(id, message) {
        let entry = null;
        if (!this.logging) {
            return null;
        }
        if (id == null) {
            id = this.entries.length;
        }
        let key = this.pair[`time${id}`];
        if (typeof key != 'undefined') {
            console.timeEnd(id);
            entry = this.entries[key];
        }
        else {
            entry = new Entry(id, 'time', this.started);
            if (typeof message != 'undefined') {
                entry.message = message;
            }
            this.entries.push(entry);
            key = (this.entries.length - 1);
        }
        let end = entry.end = microtime();
        let start = entry.start;
        let total = end - start;
        entry.total = total;
        this.entries[key] = entry;
        return total;
    }
    trace() {
        if (this.logging) {
            console.trace();
        }
    }
    logs() {
        return this.entries;
    }
    enable() {
        this.logging = true;
    }
    disable() {
        this.logging = false;
    }
}

let profilers = {};
let logging = false;
class Profiler {
    constructor(name) {
        return Profiler.make(name);
    }
    static make(name = 'default') {
        if (profilers[name] == null)
            profilers[name] = new Collector(name, logging);
        return profilers[name];
    }
    static enable() {
        logging = true;
    }
    static disable() {
        logging = false;
    }
}

let Javie = new Application();
Javie.bind('config', (attributes = {}) => {
    return new Configuration(attributes);
});
Javie.bind('profiler', (name) => {
    return name != null ? new Profiler(name) : Profiler;
});

export default Javie;

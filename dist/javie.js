var isFunction = require('lodash').isFunction;
var Container = /** @class */ (function () {
    function Container(name, instance, shared, resolved) {
        if (shared === void 0) { shared = false; }
        if (resolved === void 0) { resolved = false; }
        this._shared = false;
        this._resolved = false;
        this.name = name;
        this.instance = instance;
        this._shared = shared;
        this._resolved = resolved;
    }
    Container.prototype.resolving = function (options) {
        if (options === void 0) { options = []; }
        if (this._shared && this._resolved) {
            return this.instance;
        }
        var resolved = this.instance;
        if (isFunction(resolved)) {
            resolved = resolved.apply(this, options);
        }
        if (this._shared) {
            this.instance = resolved;
            this._resolved = true;
        }
        return resolved;
    };
    Container.prototype.resolved = function () {
        return this._resolved;
    };
    Container.prototype.shared = function () {
        return this._shared;
    };
    return Container;
}());

var defaults = require('lodash').defaults;
var isObject = require('lodash').isObject;
var isUndefined = require('lodash').isUndefined;
var Configuration = /** @class */ (function () {
    function Configuration(attributes) {
        if (attributes === void 0) { attributes = {}; }
        this.attributes = {};
        this.attributes = attributes;
    }
    Configuration.prototype.has = function (key) {
        return !isUndefined(this.attributes[key]);
    };
    Configuration.prototype.get = function (key, defaults) {
        if (defaults === void 0) { defaults = null; }
        return this.has(key) ? this.attributes[key] : defaults;
    };
    Configuration.prototype.put = function (key, value) {
        var config = key;
        if (!isObject(key)) {
            config = {};
            config[key] = value;
        }
        this.attributes = defaults(config, this.attributes);
    };
    Configuration.prototype.all = function () {
        return this.attributes;
    };
    return Configuration;
}());

var Payload = /** @class */ (function () {
    function Payload(id, callback) {
        this._id = id;
        this._callback = callback;
    }
    Payload.prototype.id = function () {
        return this._id;
    };
    Payload.prototype.callback = function () {
        return this._callback;
    };
    return Payload;
}());

var clone = require('lodash').clone;
var each = require('lodash').each;
var isArray = require('lodash').isArray;
var isNull = require('lodash').isNull;
var isFunction$1 = require('lodash').isFunction;
var events = {};
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
    }
    Dispatcher.prototype.clone = function (id) {
        return {
            to: function (to) {
                return events[to] = clone(events[id]);
            },
        };
    };
    Dispatcher.prototype.listen = function (id, callback) {
        if (!isFunction$1(callback)) {
            throw new Error("Callback is not a function.");
        }
        var payload = new Payload(id, callback);
        if (!isArray(events[id])) {
            events[id] = [];
        }
        events[id].push(callback);
        return payload;
    };
    Dispatcher.prototype.fire = function (id, options) {
        if (options === void 0) { options = []; }
        if (id == null) {
            throw new Error("Event ID [" + id + "] is not available.");
        }
        return this.dispatch(events[id], options);
    };
    Dispatcher.prototype.first = function (id, options) {
        if (id == null) {
            throw new Error("Event ID [" + id + "] is not available.");
        }
        var event = events[id].slice(0, 1);
        var responses = this.dispatch(event, options);
        return responses.shift();
    };
    Dispatcher.prototype.until = function (id, options) {
        if (id == null) {
            throw new Error("Event ID [" + id + "] is not available.");
        }
        var responses = this.dispatch(events[id], options, true);
        return responses.length < 1 ? null : responses.shift();
    };
    Dispatcher.prototype.flush = function (id) {
        if (!isNull(events[id])) {
            events[id] = null;
        }
    };
    Dispatcher.prototype.forget = function (payload) {
        var id = payload.id();
        if (!isArray(events[id])) {
            throw new Error("Event ID [" + id + "] is not available.");
        }
        each(events[id], function (callback, key) {
            if (payload.callback() == callback) {
                events[id].splice(key, 1);
            }
        });
    };
    Dispatcher.prototype.dispatch = function (queued, options, halt) {
        var _this = this;
        if (options === void 0) { options = []; }
        if (halt === void 0) { halt = false; }
        var responses = [];
        if (!isArray(queued)) {
            return null;
        }
        each(queued, function (callback, key) {
            if (halt == false || responses.length == 0) {
                var response = callback.apply(_this, options);
                responses.push(response);
            }
        });
        return responses;
    };
    return Dispatcher;
}());

var isFunction$2 = require('lodash').isFunction;
var setup = function (app) {
    app.singleton('event', function () { return new Dispatcher(); });
};
var Application = /** @class */ (function () {
    function Application(environment) {
        if (environment === void 0) { environment = 'production'; }
        this.instances = {};
        this.config = new Configuration({});
        this.environment = environment;
        setup(this);
    }
    Application.prototype.detectEnvironment = function (environment) {
        if (isFunction$2(environment)) {
            environment = environment.apply(this);
        }
        return this.environment = environment;
    };
    Application.prototype.env = function () {
        return this.environment;
    };
    Application.prototype.get = function (key, defaults) {
        if (defaults === void 0) { defaults = null; }
        return this.config.get(key, defaults);
    };
    Application.prototype.put = function (key, value) {
        this.config.put(key, value);
        return this;
    };
    Application.prototype.on = function (name, callback) {
        this.make('event').listen(name, callback);
        return this;
    };
    Application.prototype.emit = function (name, options) {
        if (options === void 0) { options = []; }
        this.make('event').emit(name, options);
        return this;
    };
    Application.prototype.bind = function (name, instance) {
        this.instances[name] = new Container(name, instance);
        return this;
    };
    Application.prototype.singleton = function (name, instance) {
        this.instances[name] = new Container(name, instance, true);
        return this;
    };
    Application.prototype.make = function (name) {
        var options = Array.prototype.slice.call(arguments);
        name = options.shift();
        if (this.instances[name] instanceof Container) {
            return this.instances[name].resolving(options);
        }
    };
    Application.prototype.when = function (environment, callback) {
        var env = this.environment;
        if (env === environment || environment == '*') {
            return this.run(callback);
        }
    };
    Application.prototype.run = function (callback) {
        if (isFunction$2(callback)) {
            return callback.call(this);
        }
    };
    return Application;
}());

var app = new Application();
app.bind('config', function (attributes) {
    if (attributes === void 0) { attributes = {}; }
    return new Configuration(attributes);
});

export default app;

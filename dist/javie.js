/**
 * ========================================================================
 * Javie
 * ========================================================================
 *
 * @package Javie
 * @require underscore, console, jQuery/Zepto
 * @version 2.0.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ========================================================================
 */

(function() {
  var Application, root, _;

  root = this;

  _ = root._;

  if (!_ && (typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
  }

  if (!_) {
    throw new Error("underscore.js is missing");
  }

  Application = (function() {
    var array_make;

    function Application() {}

    array_make = function(args) {
      return Array.prototype.slice.call(args);
    };

    Application.prototype.config = {};

    Application.prototype.environment = 'production';

    Application.prototype.instances = {};

    Application.prototype.detectEnvironment = function(environment) {
      if (_.isFunction(environment) === true) {
        environment = environment.apply(root);
      }
      return this.environment = environment;
    };

    Application.prototype.env = function() {
      return this.environment;
    };

    Application.prototype.get = function(key, alt) {
      if (typeof this.config[key] !== 'undefined') {
        return this.config[key];
      }
      return alt != null ? alt : alt = null;
    };

    Application.prototype.put = function(key, value) {
      var config;
      config = key;
      if (!_.isObject(config)) {
        config = {};
        config[key] = value;
      }
      return this.config = _.defaults(config, this.config);
    };

    Application.prototype.bind = function(name, instance) {
      return this.instances[name] = instance;
    };

    Application.prototype.make = function(name) {
      var base, options;
      options = array_make(arguments);
      name = options.shift();
      base = this.resolve(name);
      if (_.isFunction(base)) {
        return base.apply(root, options);
      }
      return base;
    };

    Application.prototype.resolve = function(name) {
      var base;
      base = this.instances[name];
      if (base === 'undefined') {
        base = null;
      }
      return base;
    };

    Application.prototype.when = function(environment, callback) {
      var env;
      if (this.ENV != null) {
        env = this.ENV;
      }
      if (this.environment != null) {
        env = this.environment;
      }
      if (env === environment || _.isNull(environment)) {
        return this.run(callback);
      }
    };

    Application.prototype.run = function(callback) {
      if (_.isFunction(callback)) {
        return callback.call(this);
      }
    };

    return Application;

  })();

  root.Javie = new Application;

}).call(this);

(function() {
  var Application, root, _;

  root = this;

  _ = root._;

  if (!_ && (typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
  }

  if (!_) {
    throw new Error("underscore.js is missing");
  }

  Application = (function() {
    var array_make;

    function Application() {}

    array_make = function(args) {
      return Array.prototype.slice.call(args);
    };

    Application.prototype.config = {};

    Application.prototype.environment = 'production';

    Application.prototype.instances = {};

    Application.prototype.detectEnvironment = function(environment) {
      if (_.isFunction(environment) === true) {
        environment = environment.apply(root);
      }
      return this.environment = environment;
    };

    Application.prototype.env = function() {
      return this.environment;
    };

    Application.prototype.get = function(key, alt) {
      if (typeof this.config[key] !== 'undefined') {
        return this.config[key];
      }
      return alt != null ? alt : alt = null;
    };

    Application.prototype.put = function(key, value) {
      var config;
      config = key;
      if (!_.isObject(config)) {
        config = {};
        config[key] = value;
      }
      return this.config = _.defaults(config, this.config);
    };

    Application.prototype.bind = function(name, instance) {
      return this.instances[name] = instance;
    };

    Application.prototype.make = function(name) {
      var base, options;
      options = array_make(arguments);
      name = options.shift();
      base = this.resolve(name);
      if (_.isFunction(base)) {
        return base.apply(root, options);
      }
      return base;
    };

    Application.prototype.resolve = function(name) {
      var base;
      base = this.instances[name];
      if (base === 'undefined') {
        base = null;
      }
      return base;
    };

    Application.prototype.when = function(environment, callback) {
      var env;
      if (this.ENV != null) {
        env = this.ENV;
      }
      if (this.environment != null) {
        env = this.environment;
      }
      if (env === environment || _.isNull(environment)) {
        return this.run(callback);
      }
    };

    Application.prototype.run = function(callback) {
      if (_.isFunction(callback)) {
        return callback.call(this);
      }
    };

    return Application;

  })();

  root.Javie = new Application;

}).call(this);

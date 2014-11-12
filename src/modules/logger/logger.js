
/*
 * ==========================================================
 * Javie.Logger
 * ==========================================================
 *
 * Logger Helper for Client-side JavaScript and Node.js
 *
 * @package Javie
 * @class   Logger
 * @require console
 * @version 2.0.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
 */

(function() {
  var Logger, LoggerRepository, array_make, dispatch, enabled, level, logger, post, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  logger = null;

  enabled = false;

  level = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEBUG: 'debug',
    LOG: 'log'
  };

  array_make = function(args) {
    return Array.prototype.slice.call(args);
  };

  dispatch = function(type, message) {
    if (!enabled) {
      return false;
    }
    return post(type, message);
  };

  post = function(type, message) {
    var c;
    c = console;
    switch (type) {
      case 'info':
        c.info(message);
        return true;
      case 'debug' && (c.debug != null):
        c.debug(message);
        return true;
      case 'warning':
        c.warn(message);
        return true;
      case 'error' && (c.error != null):
        c.error(message);
        return true;
      case 'log':
        c.log(message);
        return true;
      default:
        c.log("[" + (type.toUpperCase()) + "]", message);
        return true;
    }
  };

  Logger = (function() {
    function Logger() {}

    Logger.prototype.logs = [];

    Logger.prototype.dispatch = function(type, message) {
      var result;
      result = dispatch(type, message);
      message.unshift(type);
      this.logs.push(message);
      return result;
    };

    Logger.prototype.info = function() {
      return this.dispatch(level.INFO, array_make(arguments));
    };

    Logger.prototype.debug = function() {
      return this.dispatch(level.DEBUG, array_make(arguments));
    };

    Logger.prototype.warning = function() {
      return this.dispatch(level.WARNING, array_make(arguments));
    };

    Logger.prototype.log = function() {
      return this.dispatch(level.LOG, array_make(arguments));
    };

    Logger.prototype.post = function(type, message) {
      return this.dispatch(type, [message]);
    };

    return Logger;

  })();

  LoggerRepository = (function() {
    function LoggerRepository() {
      return LoggerRepository.make();
    }

    LoggerRepository.make = function() {
      return logger != null ? logger : logger = new Logger;
    };

    LoggerRepository.enable = function() {
      return enabled = true;
    };

    LoggerRepository.disable = function() {
      return enabled = false;
    };

    LoggerRepository.status = function() {
      return enabled;
    };

    return LoggerRepository;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    if ((typeof module !== "undefined" && module !== null) && module.exports) {
      module.exports = LoggerRepository;
    }
    root.Logger = LoggerRepository;
  } else {
    if (root.Javie == null) {
      root.Javie = {};
    }
    root.Javie.Logger = LoggerRepository;
  }

}).call(this);

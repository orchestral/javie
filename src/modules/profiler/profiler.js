
/*
 * ==========================================================
 * Javie.Profiler
 * ==========================================================
 *
 * Profiler Helper for Client-side JavaScript and Node.js
 *
 * @package Javie
 * @class   Profiler
 * @require console
 * @version 2.0.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
 */

(function() {
  var Profiler, ProfilerRepository, enabled, profilers, root;

  profilers = {};

  enabled = false;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Profiler = (function() {
    var microtime, schema;

    schema = function(id, type, start) {
      if (id == null) {
        id = '';
      }
      if (type == null) {
        type = '';
      }
      if (start == null) {
        start = microtime(true);
      }
      return {
        id: id,
        type: type,
        start: start,
        end: null,
        total: null,
        message: ''
      };
    };

    microtime = function(seconds) {
      var ms, sec, time;
      time = new Date().getTime();
      ms = parseInt(time / 1000, 10);
      sec = "" + ((time - (ms * 1000)) / 1000) + " sec";
      if (seconds === true) {
        return ms;
      } else {
        return sec;
      }
    };

    Profiler.prototype.logs = null;

    Profiler.prototype.pair = null;

    Profiler.prototype.started = null;

    function Profiler() {
      this.logs = [];
      this.pair = {};
      this.started = microtime(true);
    }

    Profiler.prototype.time = function(id, message) {
      var key, log;
      if (id == null) {
        id = this.logs.length;
      }
      if (enabled === false) {
        return null;
      }
      log = schema('time', id);
      log.message = message.toString();
      key = this.pair["time" + id];
      if (typeof key !== 'undefined') {
        this.logs[key] = log;
      } else {
        this.logs.push(log);
        this.pair["time" + id] = this.logs.length - 1;
      }
      console.time(id);
      return id;
    };

    Profiler.prototype.timeEnd = function(id, message) {
      var end, key, log, start, total;
      if (id == null) {
        id = this.logs.length;
      }
      if (enabled === false) {
        return null;
      }
      key = this.pair["time" + id];
      if (typeof key !== 'undefined') {
        console.timeEnd(id);
        log = this.logs[key];
      } else {
        log = schema('time', id, this.started);
        if (typeof message !== 'undefined') {
          log.message = message;
        }
        this.logs.push(log);
        key = this.logs.length - 1;
      }
      end = log.end = microtime(true);
      start = log.start;
      total = end - start;
      log.total = total;
      this.logs[key] = log;
      return total;
    };

    Profiler.prototype.trace = function() {
      if (enabled) {
        console.trace();
      }
      return true;
    };

    Profiler.prototype.output = function(auto) {
      var log, sec, _i, _len, _ref;
      if (auto === true) {
        enabled = true;
      }
      if (enabled === false) {
        return false;
      }
      _ref = this.logs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        log = _ref[_i];
        if (log.type === 'time') {
          sec = Math.floor(log.total * 1000);
          console.log('%s: %s - %dms', log.id, log.message, sec);
        } else {
          console.log(log.id, log.message);
        }
      }
      return true;
    };

    return Profiler;

  })();

  ProfilerRepository = (function() {
    function ProfilerRepository(name) {
      return ProfilerRepository.make(name);
    }

    ProfilerRepository.make = function(name) {
      if (!((name != null) || name !== '')) {
        name = 'default';
      }
      return profilers[name] != null ? profilers[name] : profilers[name] = new Profiler;
    };

    ProfilerRepository.enable = function() {
      return enabled = true;
    };

    ProfilerRepository.disable = function() {
      return enabled = false;
    };

    ProfilerRepository.status = function() {
      return enabled;
    };

    return ProfilerRepository;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    if ((typeof module !== "undefined" && module !== null) && module.exports) {
      module.exports = ProfilerRepository;
    }
    exports.Profiler = ProfilerRepository;
  } else {
    if (root.Javie == null) {
      root.Javie = {};
    }
    root.Javie.Profiler = ProfilerRepository;
  }

}).call(this);

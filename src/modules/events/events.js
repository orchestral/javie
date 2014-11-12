
/*
 * ==========================================================
 * Javie.EventDispatcher
 * ==========================================================
 *
 * Event Dispatcher Helper for Client-side JavaScript
 * and Node.js
 *
 * @package Javie
 * @class   Event
 * @require underscore
 * @version 2.0.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
 */

(function() {
  var EventDispatcher, EventRepository, dispatcher, events, root, _;

  dispatcher = null;

  events = {};

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  _ = root._;

  if (!_ && (typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
  }

  if (!_) {
    throw new Error("underscore.js is missing");
  }

  EventDispatcher = (function() {
    function EventDispatcher() {}

    EventDispatcher.prototype.clone = function(id) {
      var clonable;
      return clonable = {
        to: function(cloneTo) {
          events[cloneTo] = _.clone(events[id]);
          return true;
        }
      };
    };

    EventDispatcher.prototype.listen = function(id, cb) {
      var response;
      if (_.isFunction(cb) === false) {
        throw new Error("Callback is not a function");
      }
      response = {
        id: id,
        cb: cb
      };
      if (events[id] == null) {
        events[id] = [];
      }
      events[id].push(cb);
      return response;
    };

    EventDispatcher.prototype.listener = function(id, cb) {
      return this.listen(id, cb);
    };

    EventDispatcher.prototype.fire = function(id, options) {
      var me, response, runEachEvent;
      me = this;
      response = [];
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      runEachEvent = function(cb, key) {
        return response.push(cb.apply(me, options || []));
      };
      _.each(events[id], runEachEvent);
      return response;
    };

    EventDispatcher.prototype.first = function(id, options) {
      var first, me, response, runEachEvent;
      me = this;
      response = [];
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      first = events[id].slice(0, 1);
      runEachEvent = function(cb, key) {
        return response.push(cb.apply(me, options || []));
      };
      _.each(first, runEachEvent);
      return response[0];
    };

    EventDispatcher.prototype.until = function(id, options) {
      var me, response, runEachEvent;
      me = this;
      response = null;
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      runEachEvent = function(cb, key) {
        if (response == null) {
          return response.push(cb.apply(me, options || []));
        }
      };
      _.each(events[id], runEachEvent);
      return response;
    };

    EventDispatcher.prototype.flush = function(id) {
      if (!_.isUndefined(events[id])) {
        events[id] = null;
      }
      return true;
    };

    EventDispatcher.prototype.forget = function(handler) {
      var cb, id, loopEachEvent, me;
      me = this;
      id = handler.id;
      cb = handler.cb;
      if (!_.isString(id)) {
        throw new Error("Event ID [" + id + "] is not provided");
      }
      if (!_.isFunction(cb)) {
        throw new Error('Callback is not a function');
      }
      if (events[id] == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      loopEachEvent = function(callback, key) {
        if (callback === cb) {
          return events[id].splice(key, 1);
        }
      };
      _.each(events[id], loopEachEvent);
      return true;
    };

    return EventDispatcher;

  })();

  EventRepository = (function() {
    function EventRepository() {
      return EventRepository.make();
    }

    EventRepository.make = function() {
      return dispatcher != null ? dispatcher : dispatcher = new EventDispatcher;
    };

    return EventRepository;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    if ((typeof module !== "undefined" && module !== null) && module.exports) {
      module.exports = EventRepository;
    }
    exports.EventDispatcher = EventRepository;
  } else {
    if (root.Javie == null) {
      root.Javie = {};
    }
    root.Javie.Events = EventRepository;
    root.Javie.EventDispatcher = EventRepository;
  }

}).call(this);

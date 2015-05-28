
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
 * @version 1.2.0
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

    EventDispatcher.prototype.listen = function(id, callback) {
      var response;
      if (_.isFunction(callback) === false) {
        throw new Error("Callback is not a function");
      }
      response = {
        id: id,
        callback: callback
      };
      if (events[id] == null) {
        events[id] = [];
      }
      events[id].push(callback);
      return response;
    };

    EventDispatcher.prototype.listener = function(id, callback) {
      return this.listen(id, callback);
    };

    EventDispatcher.prototype.fire = function(id, options) {
      var me, responses, run_each_events;
      me = this;
      responses = [];
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      run_each_events = function(callback, key) {
        var applied;
        applied = callback.apply(me, options || []);
        return responses.push(applied);
      };
      _.each(events[id], run_each_events);
      return responses;
    };

    EventDispatcher.prototype.first = function(id, options) {
      var first, me, responses, run_each_events;
      me = this;
      responses = [];
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      first = events[id].slice(0, 1);
      run_each_events = function(callback, key) {
        var applied;
        applied = callback.apply(me, options || []);
        return responses.push(applied);
      };
      _.each(first, run_each_events);
      return responses[0];
    };

    EventDispatcher.prototype.until = function(id, options) {
      var me, responses, run_each_events;
      me = this;
      responses = null;
      if (id == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      if (events[id] == null) {
        return null;
      }
      run_each_events = function(callback, key) {
        var applied;
        applied = callback.apply(me, options || []);
        if (responses == null) {
          return responses.push(applied);
        }
      };
      _.each(events[id], run_each_events);
      return responses;
    };

    EventDispatcher.prototype.flush = function(id) {
      if (!_.isUndefined(events[id])) {
        events[id] = null;
      }
      return true;
    };

    EventDispatcher.prototype.forget = function(handler) {
      var id, loop_each_events, me, ref;
      me = this;
      id = handler.id;
      ref = handler.callback;
      if (!_.isString(id)) {
        throw new Error("Event ID [" + id + "] is not provided");
      }
      if (!_.isFunction(callback)) {
        throw new Error('Callback is not a function');
      }
      if (events[id] == null) {
        throw new Error("Event ID [" + id + "] is not available");
      }
      loop_each_events = function(callback, key) {
        if (ref === callback) {
          return events[id].splice(key, 1);
        }
      };
      _.each(events[id], loop_each_events);
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

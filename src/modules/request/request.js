
/*
 * ==========================================================
 * Javie.Request
 * ==========================================================
 *
 * Request Helper for Client-side JavaScript
 *
 * @package Javie
 * @class   Request
 * @require underscore, jQuery/Zepto
 * @version 1.1.3
 * @since   0.1.1
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT
 * ==========================================================
 */

(function() {
  var Request, RequestRepository, api, dispatcher, requests, root, _;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  requests = {};

  dispatcher = null;

  if (typeof root.Javie === 'undefined') {
    throw new Error("Javie is missing");
  }

  if (typeof root.Javie.EventDispatcher === 'undefined') {
    throw new Error("Javie.EventDispatcher is missing");
  }

  dispatcher = root.Javie.EventDispatcher.make();

  _ = root._;

  if (!_ && (typeof require !== "undefined" && require !== null)) {
    _ = require('underscore');
  }

  if (!_) {
    throw new Error("underscore.js is missing");
  }

  api = root.$;

  if (typeof api === 'undefined' || api === null) {
    throw new Error("Required jQuery or Zepto object is missing");
  }

  Request = (function() {
    var json_parse;

    function Request() {}

    json_parse = function(data) {
      var e;
      if (_.isString(data) === true) {
        try {
          data = api.parseJSON(data);
        } catch (_error) {
          e = _error;
        }
      }
      return data;
    };

    Request.prototype.executed = false;

    Request.prototype.response = null;

    Request.prototype.config = {
      'name': '',
      'type': 'GET',
      'uri': '',
      'query': '',
      'data': '',
      'dataType': 'json',
      'id': '',
      'object': null
    };

    Request.prototype.get = function(key, alt) {
      if (typeof this.config[key] !== 'undefined') {
        return this.config[key];
      }
      return alt != null ? alt : alt = null;
    };

    Request.prototype.put = function(key, value) {
      var config;
      config = key;
      if (!_.isObject(key)) {
        config = {};
        config[key] = value;
      }
      return this.config = _.defaults(config, this.config);
    };

    Request.prototype.to = function(url, object, data_type) {
      var id, queries, request_method, segment, type, uri;
      this.put({
        'dataType': data_type != null ? data_type : data_type = 'json'
      });
      request_method = ['POST', 'GET', 'PUT', 'DELETE'];
      if (_.isUndefined(url)) {
        throw new Error("Missing required url parameter");
      }
      if (object == null) {
        object = root.document;
      }
      this.put({
        'object': object
      });
      segment = url.split(' ');
      if (segment.length === 1) {
        uri = segment[0];
      } else {
        if (_.indexOf(request_method, segment[0]) !== -1) {
          type = segment[0];
        }
        uri = segment[1];
        if (type !== 'GET') {
          queries = uri.split('?');
          if (queries.length > 1) {
            url = queries[0];
            this.put({
              'query': queries[1]
            });
          }
        }
        uri = uri.replace(':baseUrl', this.get('baseUrl', ''));
        this.put({
          'type': type,
          'uri': uri
        });
      }
      id = api(this.get('object')).attr('id');
      if (typeof id !== 'undefined') {
        this.put({
          'id': "#" + id
        });
      }
      return this;
    };

    Request.prototype.execute = function(data) {
      var me, name, request;
      me = this;
      name = this.get('name');
      if (!_.isObject(data)) {
        data = "" + (api(this.get('object')).serialize()) + "&" + (this.get('query'));
        if (data === '?&') {
          data = '';
        }
      }
      this.executed = true;
      dispatcher.fire('Request.beforeSend', [this]);
      dispatcher.fire("Request.beforeSend: " + name, [this]);
      this.config['beforeSend'](this);
      request = {
        'type': this.get('type'),
        'dataType': this.get('dataType'),
        'url': this.get('uri'),
        'data': data,
        'complete': function(xhr) {
          var status;
          data = json_parse(xhr.responseText);
          status = xhr.status;
          me.response = xhr;
          if (!_.isUndefined(data) && data.hasOwnProperty('errors')) {
            dispatcher.fire('Request.onError', [data.errors, status, me]);
            dispatcher.fire("Request.onError: " + name, [data.errors, status, me]);
            me.config['onError'](data.errors, status, me);
            data.errors = null;
          }
          dispatcher.fire('Request.onComplete', [data, status, me]);
          dispatcher.fire("Request.onComplete: " + name, [data, status, me]);
          me.config['onComplete'](data, status, me);
          return true;
        }
      };
      api.ajax(request);
      return this;
    };

    return Request;

  })();

  RequestRepository = (function() {
    var find_request;

    find_request = function(name) {
      var child, child_name, parent, request;
      request = null;
      if (!_.isUndefined(requests[name])) {
        parent = requests[name];
        if (parent.executed === true) {
          child_name = _.uniqueId("" + name + "_");
          child = new Request;
          dispatcher.clone("Request.onError: " + name).to("Request.onError: " + child_name);
          dispatcher.clone("Request.onComplete: " + name).to("Request.onComplete: " + child_name);
          dispatcher.clone("Request.beforeSend: " + name).to("Request.beforeSend: " + child_name);
          child.put(parent.config);
          request = child;
        }
        request = parent;
      } else {
        request = new Request;
        request.config = _.defaults(request.config, RequestRepository.config);
        request.put({
          'name': name
        });
        requests[name] = request;
      }
      return request;
    };

    function RequestRepository(name) {
      return RequestRepository.make(name);
    }

    RequestRepository.make = function(name) {
      if (!_.isString(name)) {
        name = 'default';
      }
      return find_request(name);
    };

    RequestRepository.config = {
      'baseUrl': null,
      'onError': function(data, status) {},
      'beforeSend': function(data, status) {},
      'onComplete': function(data, status) {}
    };

    RequestRepository.get = function(key, alt) {
      if (alt == null) {
        alt = null;
      }
      if (_.isUndefined(this.config[key])) {
        return alt;
      }
      return this.config[key];
    };

    RequestRepository.put = function(key, value) {
      var config;
      config = key;
      if (!_.isObject(key)) {
        config = {};
        config[key] = value;
      }
      return this.config = _.defaults(config, this.config);
    };

    return RequestRepository;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    if ((typeof module !== "undefined" && module !== null) && module.exports) {
      module.exports = RequestRepository;
    }
    root.Request = RequestRepository;
  } else {
    root.Javie.Request = RequestRepository;
  }

}).call(this);

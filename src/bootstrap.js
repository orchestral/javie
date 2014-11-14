(function() {
  var javie, root;

  root = this;

  javie = root.Javie;

  javie.bind('underscore', function() {
    return root._;
  });

  javie.bind('event', function() {
    return new javie.EventDispatcher;
  });

  javie.bind('profiler', function(name) {
    if (name != null) {
      return new javie.Profiler(name);
    }
    return javie.Profiler;
  });

  javie.bind('log', function() {
    return new javie.Logger;
  });

  javie.bind('request', function(name) {
    if (name != null) {
      return new javie.Request(name);
    }
    return javie.Request;
  });

}).call(this);

(function() {
  var javie, root;

  root = this;

  javie = root.Javie;

  javie.singleton('underscore', root._);

  javie.singleton('event', function() {
    return new javie.EventDispatcher;
  });

  javie.bind('profiler', function(name) {
    if (name != null) {
      return new javie.Profiler(name);
    } else {
      return javie.Profiler;
    }
  });

  javie.bind('log', function() {
    return new javie.Logger;
  });

  javie.bind('request', function(name) {
    if (name != null) {
      return new javie.Request(name);
    } else {
      return javie.Request;
    }
  });

}).call(this);

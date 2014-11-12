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
    return new javie.Profiler(name);
  });

  javie.bind('log', function() {
    return new javie.Logger;
  });

  javie.bind('request', function(name) {
    return new javie.Request(name);
  });

}).call(this);

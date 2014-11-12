root = @
javie = root.Javie

javie.bind('underscore', -> root._)
javie.bind('event', -> new javie.EventDispatcher)
javie.bind('profiler', (name) -> new javie.Profiler(name))
javie.bind('log', -> new javie.Logger)
javie.bind('request', (name) -> new javie.Request(name))

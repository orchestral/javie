root = @
javie = root.Javie

javie.bind('underscore', -> root._)

javie.bind('event', -> new javie.EventDispatcher)

javie.bind('profiler', (name) ->
    return new javie.Profiler(name) if name?
    javie.Profiler
)

javie.bind('log', -> new javie.Logger)

javie.bind('request', (name) ->
    return new javie.Request(name) if name?
    javie.Request
)

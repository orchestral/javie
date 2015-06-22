root = @
javie = root.Javie

javie.singleton 'underscore', root._

javie.singleton 'event', ->
  new javie.EventDispatcher

javie.bind 'profiler', (name) ->
  if name? then new javie.Profiler(name) else javie.Profiler

javie.bind 'log', ->
  new javie.Logger

javie.bind 'request', (name) ->
  if name? then new javie.Request(name) else javie.Request


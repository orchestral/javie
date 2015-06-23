import _ from './vendor/underscore'
import Application from './Application.es6'
import Events from './modules/events/Events.es6'
import Log from './modules/log/Log.es6'
import Profiler from './modules/profiler/Profiler.es6'
import Request from './modules/request/Request.es6'

var app = new Application()

app.singleton('underscore', _)

app.singleton('event', () => new Events())

app.singleton('log', () => Log)
app.singleton('log.writer', () => new Log())

app.bind('profiler', (name = null) => {
  if (name != null)
    return Profiler(name)

  return Profiler
})

app.bind('request', (name = null) => {
  if (name != null)
    return Request(name)

  return Request
})

window.Javie = app

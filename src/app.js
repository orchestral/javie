import _ from './vendor/underscore'
import Application from './Application.es6'
import Configuration from './modules/config/Config.es6'
import Events from './modules/events/Events.es6'
import Log from './modules/log/Log.es6'
import Profiler from './modules/profiler/Profiler.es6'
import Request from './modules/request/Request.es6'

var app = new Application()

app.singleton('underscore', _)

app.singleton('event', () => new Events())

app.singleton('log', () => Log)
app.singleton('log.writer', () => new Log())

app.bind('config', (attributes = {}) => {
  return new Configuration(attributes)
})

app.bind('profiler', (name = null) => {
  return name != null ? new Profiler(name) : Profiler
})

app.bind('request', (name = null) => {
  return name != null ? new Request(name) : Request
})

window.Javie = app

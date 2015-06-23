import * as Util from '../../helpers'

let writer = null
let enabled = false
let level = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
  LOG: 'log'
}

function dispatch (type, message) {
  if (enabled) {
    post(type, message)
  }
}

function post (type, message) {
  let c = console

  switch (type) {
    case 'info':
      c.info(message)
      break
    case 'debug' && (c.debug != null):
      c.debug(message)
      break;
    case 'warning':
      c.warn(message)
      break
    case 'error' && (c.error != null):
      c.error(message)
      break
    case 'log':
      c.log(message)
      break
    default:
      c.log(`[${type.toUpperCase()}]`, message)
  }
}

class Writer {
  logs = []

  dispatch(type, message) {
    let result = dispatch(type, message)
    message.unshift(type)
    this.logs.push(message)
  }

  info() {
    this.dispatch(level.INFO, Util.array_make(arguments))
  }

  debug() {
    this.dispatch(level.DEBUG, Util.array_make(arguments))
  }

  warning() {
    this.dispatch(level.WARNING, Util.array_make(arguments))
  }

  log() {
    this.dispatch(level.LOG, Util.array_make(arguments))
  }

  post(type, mesage) {
    this.dispatch(type, [message])
  }
}

class Log {
  constructor() {
    return Log.make()
  }

  static make() {
    if (writer == null)
      writer = new Writer()

    return writer
  }

  static enable() {
    enabled = true
  }

  static disable() {
    enabled = false
  }

  static status() {
    return enabled
  }
}

export default Log

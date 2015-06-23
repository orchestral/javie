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
  if (enabled)
    return post(type, message)
}

function post (type, message) {
  let c = console

  switch (type) {
    case 'info':
      c.info(message)
      return true
    case 'debug' && (c.debug != null):
      c.debug(message)
      return true
    case 'warning':
      c.warn(message)
      return true
    case 'error' && (c.error != null):
      c.error(message)
      return true
    case 'log':
      c.log(message)
      return true
    default :
      c.log(`[${type.toUpperCase()}]`, message)
      return true
  }
}

class Writer {
  constructor() {
    this.logs = []
  }

  dispatch(type, message) {
    let result = dispatch(type, message)
    message.unshift(type)
    this.logs.push(message)

    return result
  }

  info() {
    return this.dispatch(level.INFO, Util.array_make(arguments))
  }

  debug() {
    return this.dispatch(level.DEBUG, Util.array_make(arguments))
  }

  warning() {
    return this.dispatch(level.WARNING, Util.array_make(arguments))
  }

  log() {
    return this.dispatch(level.LOG, Util.array_make(arguments))
  }

  post(type, message) {
    return this.dispatch(type, [message])
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

import _ from '../../vendor/underscore'
let dispatcher = null
let events = {}

class Payload {
  constructor(id, callback) {
    this.id = id
    this.callback = callback
  }

  getId() {
    return this.id
  }

  getCallback() {
    return this.callback
  }
}

class Dispatcher {
  clone(id) {
    return {
      to: to => events[to] = _.clone(events[id])
    }
  }

  listen(id, callback) {
    if (!_.isFunction(callback))
      throw new Error("Callback is not a function.")

    let response = new Payload(id, callback)

    if (!_.isArray(events[id]))
      events[id] = []

    events[id].push(callback)

    return response
  }

  fire(id, options = []) {
    if (id == null)
      throw new Error(`Event ID [${id}] is not available.`)

    return this.dispatch(events[id], options)
  }

  first(id, options) {
    if (id == null)
      throw new Error(`Event ID [${id}] is not available.`)

    let first = events[id].slice(0, 1)
    let responses = this.dispatch(first, options)

    return responses.shift()
  }

  until(id, options) {
    if (id == null)
      throw new Error(`Event ID [${id}] is not available.`)

    let responses = this.dispatch(events[id], options, true)

    return responses.length < 1 ? null : responses.shift()
  }

  flush(id) {
    if (!_.isNull(events[id]))
      events[id] = null
  }

  forget(handler) {
    let me = this

    if (! handler instanceof Payload)
      throw new Error(`Invalid payload for Event ID [${id}]`)

    let id = handler.getId()
    let ref = handler.getCallback()

    if (!_.isArray(events[id]))
      throw new Error(`Event ID [${id}] is not available.`)

    _.each(events[id], (callback, key) => {
      if (ref == callback) {
        events[id].splice(key, 1)
      }
    })
  }

  dispatch(queued, options = [], halt = false) {
    let responses = []

    if (!_.isArray(queued))
      return null;

    _.each(queued, (callback, key) => {
      if (halt == false || responses.length == 0) {
        let applied = callback.apply(this, options)
        responses.push(applied)
      }
    })

    return responses
  }
}

class Events {
  constructor() {
    return Events.make()
  }

  static make() {
    if (dispatcher == null)
      dispatcher = new Dispatcher()

    return dispatcher
  }
}

export default Events

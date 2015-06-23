import _ from '../../vendor/underscore'
let dispatcher = null
let events = {}

class Dispatcher {
  clone(id) {
    return clonable = {
      to: to => events[to] = _.clone(events[id])
    }
  }

  listen(id, callback) {
    if (!_.isFunction(callback))
      throw new Error("Callback is not a function.")

    let response = {
      id: id,
      callback: callback
    }

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
    let id = handler.id
    let ref = handler.callback

    if (!_.isString(id))
      throw new Error(`Event ID [${id}] is not provided.`)
    if (!_.isFunction(ref))
      throw new Error(`Callback is not a function.`)
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

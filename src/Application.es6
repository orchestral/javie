import * as Util from './helpers'
import Configuration from './modules/config/Config.es6'
import _ from './vendor/underscore'

class Container {
  constructor(name, instance, shared = false, resolved = false) {
    this.name = name
    this.instance = instance
    this.shared = shared
    this.resolved = resolved
  }

  resolving(options = []) {
    if (this.isShared() && this.isResolved())
      return this.instance

    let resolved = this.instance

    if (_.isFunction(resolved))
      resolved = resolved.apply(this, options)

    if (this.isShared()) {
      this.instance = resolved
      this.resolved = true
    }

    return resolved
  }

  isResolved() {
    return this.resolved
  }

  isShared() {
    return this.shared
  }
}

class Application {
  constructor(environment = 'production') {
    this.config = new Configuration()
    this.environment = environment
    this.instances = {}
  }

  detectEnvironment(environment) {
    if (_.isFunction(environment))
      environment = environment.apply(this)

    return this.environment = environment
  }

  env() {
    return this.environment
  }

  get(key, defaults = null) {
    return this.config.get(key, defaults)
  }

  put(key, value) {
    this.config.put(key, value)

    return this
  }

  on(name, callback) {
    let events = this.make('event')
    events.listen(name, callback)

    return this
  }

  emit(name, options = []) {
    let events = this.make('event')
    events.fire(name, options)

    return this
  }

  trigger(name, options = []) {
    return this.emit(name, options)
  }

  bind(name, instance) {
    this.instances[name] = new Container(name, instance)

    return this
  }

  make(name) {
    let options = Util.array_make(arguments)
    name = options.shift()

    if (this.instances[name] instanceof Container)
      return this.instances[name].resolving(options)
  }

  singleton(name, instance) {
    this.instances[name] = new Container(name, instance, true)

    return this
  }

  when(environment, callback) {
    let env = this.environment

    if (env === environment || environment == '*')
      return this.run(callback)
  }

  run(callback) {
    if (_.isFunction(callback))
      return callback.call(this)
  }
}

export default Application

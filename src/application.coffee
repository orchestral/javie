root = @
_ = root._
_ = require('underscore') if !_ and require?

unless _
  throw new Error "underscore.js is missing"

array_make = (args) ->
  Array.prototype.slice.call args

class Application
  config: {}
  environment: 'production'
  instances: {}
  detectEnvironment: (environment) ->
    if _.isFunction(environment) is yes
      environment = environment.apply root

    @environment = environment
  env: ->
    @environment
  get: (key, alt) ->
    return @config[key] if typeof @config[key] isnt 'undefined'

    alt ?= null
  put: (key, value) ->
    config = key
    unless _.isObject config
      config = {}
      config[key] = value

    @config = _.defaults config, @config
    @
  on: (name, callback) ->
    dispatcher = @make 'event'
    dispatcher.listen name, callback
    @
  trigger: (name, options) ->
    dispatcher = @make 'event'
    dispatcher.fire name, options
    @
  bind: (name, instance) ->
    @instances[name] = [instance, false, null]
    @
  make: (name) ->
    options = array_make arguments
    name = options.shift()
    base = @resolve name
    resolving = base[0]

    if base[1] is yes and base[2] is yes
      return resolving

    resolved = if _.isFunction(resolving) then resolving.apply(root, options) else resolving

    if base[1] is yes
      @instances[name][0] = resolved
      @instances[name][2] = true

    resolved
  resolve: (name) ->
    base = @instances[name]
    if _.isUndefined(base) then null else base[0]
  singleton: (name, instance) ->
    @instances[name] = [instance, true, false]
    @
  when: (environment, callback) ->
    env = @ENV if @ENV?
    env = @environment if @environment?

    if env is environment or environment is '*'
      return @run callback
  run: (callback) ->
    if _.isFunction(callback)
      return callback.call @

root.Javie = new Application

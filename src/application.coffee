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
    dispatcher = @instances['event']
    dispatcher.listen name, callback
    @
  trigger: (name, options) ->
    dispatcher = @instances['event']
    dispatcher.fire name, options
    @
  bind: (name, instance) ->
    @instances[name] = instance
    @
  make: (name) ->
    options = array_make arguments
    name = options.shift()
    base = @resolve name

    if _.isFunction(base) then base.apply(root, options) else base
  resolve: (name) ->
    base = @instances[name]
    if _.isUndefined(base) then null else base
  when: (environment, callback) ->
    env = @ENV if @ENV?
    env = @environment if @environment?

    if env is environment or environment is '*'
      return @run callback
  run: (callback) ->
    if _.isFunction(callback)
      return callback.call @

root.Javie = new Application

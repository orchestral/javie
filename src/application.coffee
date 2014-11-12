root = @
_ = root._
_ = require('underscore') if !_ and require?

unless _
    throw new Error("underscore.js is missing")

class Application
    array_make = (args) ->
        Array.prototype.slice.call(args)
    config: {}
    environment: 'production'
    instances: {}
    detectEnvironment: (environment) ->
        environment = environment.apply(root) if _.isFunction(environment) is yes

        @environment = environment
    env: ->
        @environment
    get: (key, alt) ->
        return @config[key] if typeof @config[key] isnt 'undefined'

        alt ?= null
    put: (key, value) ->
        config = key
        unless _.isObject(config)
            config = {}
            config[key] = value

        @config = _.defaults(config, @config)
    bind: (name, instance) ->
        @instances[name] = instance
    make: (name) ->
        options = array_make(arguments)
        name = options.shift()
        base = @resolve(name)

        return base.apply(root, options) if _.isFunction(base)

        base
    resolve: (name) ->
        base = @instances[name]
        base = null if _.isUndefined(base)

        base
    when: (environment, callback) ->
        env = @ENV if @ENV?
        env = @environment if @environment?

        @run(callback) if env is environment or environment is '*'
    run: (callback) ->
        callback.call(@) if _.isFunction(callback)

root.Javie = new Application

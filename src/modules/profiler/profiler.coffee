###
 * ==========================================================
 * Javie.Profiler
 * ==========================================================
 *
 * Profiler Helper for Client-side JavaScript and Node.js
 *
 * @package Javie
 * @class   Profiler
 * @require console
 * @version 1.2.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
###

profilers = {}
enabled = false
root = exports ? this

schema = (id, type, start) ->
    id ?= ''
    type ?= ''
    start ?= microtime(true)

    {
        id: id
        type: type
        start: start
        end: null
        total: null
        message: ''
    }

microtime = (seconds) ->
    time = new Date().getTime()
    ms   = parseInt(time / 1000, 10)
    sec  = "#{(time-(ms*1000))/1000} sec"

    if seconds is yes then ms else sec

class Profiler

    logs: null
    pair: null
    started: null

    constructor: ->
        @logs = []
        @pair = {}
        @started = microtime(true)

    time: (id, message) ->
        id ?= @logs.length

        return null if enabled is no

        log = schema('time', id)
        log.message = message.toString()

        key = @pair["time#{id}"]

        if typeof key isnt 'undefined'
            @logs[key] = log
        else
            @logs.push(log)
            @pair["time#{id}"] = (@logs.length - 1)

        console.time(id)
        id

    timeEnd: (id, message) ->
        id ?= @logs.length

        return null if enabled is no

        key = @pair["time#{id}"]

        if typeof key isnt 'undefined'
            console.timeEnd(id)
            log = @logs[key]
        else
            log = schema('time', id, @started)
            log.message = message unless typeof message is 'undefined'

            @logs.push(log)
            key = (@logs.length - 1)

        end = log.end = microtime(true)
        start = log.start
        total = end - start
        log.total = total
        @logs[key] = log

        total

    trace: ->
        console.trace() if enabled
        true

    output: (auto) ->
        if auto is yes then enabled = true

        return false if enabled is no

        for log in @logs
            if log.type is 'time'
                sec = Math.floor(log.total * 1000)
                console.log('%s: %s - %dms', log.id, log.message, sec)
            else
                console.log(log.id, log.message)
        true

class ProfilerRepository

    constructor: (name) ->
        return ProfilerRepository.make(name)

    @make: (name) ->
        name = 'default' unless name? or name isnt ''
        profilers[name] ?= new Profiler

    @enable: ->
        enabled = true

    @disable: ->
        enabled = false

    @status: ->
        enabled

if exports?
    module.exports = ProfilerRepository if module? and module.exports
    exports.Profiler = ProfilerRepository
else
    root.Javie = {} unless root.Javie?
    root.Javie.Profiler = ProfilerRepository

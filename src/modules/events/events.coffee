###
 * ==========================================================
 * Javie.EventDispatcher
 * ==========================================================
 *
 * Event Dispatcher Helper for Client-side JavaScript
 * and Node.js
 *
 * @package Javie
 * @class   Event
 * @require underscore
 * @version 1.2.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
###

dispatcher = null
events = {}
root = exports ? this

_ = root._
_ = require('underscore') if !_ and require?

unless _
  throw new Error "underscore.js is missing"

class EventDispatcher
  clone: (id) ->
    clonable =
      to: (cloneTo) ->
        events[cloneTo] = _.clone(events[id])
        true
  listen: (id, callback) ->
    if _.isFunction(callback) is no
      throw new Error "Callback is not a function"

    response =
      id: id
      callback: callback

    events[id] ?= []
    events[id].push callback

    response
  listener: (id, callback) ->
    @listen id, callback
  fire: (id, options) ->
    me = @
    responses = []

    unless id?
      throw new Error "Event ID [#{id}] is not available"

    return null unless events[id]?

    run_each_events = (callback, key) ->
      applied = callback.apply me, options || []
      responses.push applied

    _.each events[id], run_each_events

    responses
  first: (id, options) ->
    me = @
    responses = []

    unless id?
      throw new Error "Event ID [#{id}] is not available"

    return null unless events[id]?

    first = events[id].slice 0, 1

    run_each_events = (callback, key) ->
      applied = callback.apply me, options || []
      responses.push applied

    _.each first, run_each_events

    responses[0]
  until: (id, options) ->
    me = @
    responses = null

    unless id?
      throw new Error "Event ID [#{id}] is not available"

    return null unless events[id]?

    run_each_events = (callback, key) ->
      applied = callback.apply me, options || []
      responses.push(applied) unless responses?

    _.each events[id], run_each_events

    responses
  flush: (id) ->
    events[id] = null unless _.isUndefined(events[id])
    true

  forget: (handler) ->
    me = @
    id = handler.id
    ref = handler.callback;

    unless _.isString(id)
      throw new Error "Event ID [#{id}] is not provided"
    unless _.isFunction(ref)
      throw new Error 'Callback is not a function'
    unless events[id]?
      throw new Error "Event ID [#{id}] is not available"

    loop_each_events = (callback, key) ->
      if ref is callback
        events[id].splice key, 1

    _.each events[id], loop_each_events
    true

class EventRepository
  constructor: ->
    return EventRepository.make()
  @make: ->
    dispatcher ?= new EventDispatcher

if exports?
  module.exports = EventRepository if module? and module.exports
  exports.EventDispatcher = EventRepository
else
  root.Javie = {} unless root.Javie?
  root.Javie.Events = EventRepository
  root.Javie.EventDispatcher = EventRepository

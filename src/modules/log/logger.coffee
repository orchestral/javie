###
 * ==========================================================
 * Javie.Logger
 * ==========================================================
 *
 * Logger Helper for Client-side JavaScript and Node.js
 *
 * @package Javie
 * @class   Logger
 * @require console
 * @version 1.2.0
 * @since   0.1.0
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT License
 * ==========================================================
###

root = exports ? this
logger = null
enabled = false
level =
  ERROR: 'error'
  WARNING: 'warning'
  INFO: 'info'
  DEBUG: 'debug'
  LOG: 'log'

array_make = (args) ->
  Array.prototype.slice.call args

dispatch = (type, message) ->
  return false unless enabled

  post(type, message)

post = (type, message) ->
  c = console
  switch type
    when 'info'
      c.info message
      true
    when 'debug' and c.debug?
      c.debug message
      true
    when 'warning'
      c.warn message
      true
    when 'error' and c.error?
      c.error message
      true
    when 'log'
      c.log message
      true
    else
      c.log "[#{type.toUpperCase()}]", message
      true

class Logger
  logs: []
  dispatch: (type, message) ->
    result = dispatch type, message
    message.unshift type
    @logs.push message

    result
  info: ->
    @dispatch level.INFO, array_make(arguments)
  debug: ->
    @dispatch level.DEBUG, array_make(arguments)
  warning: ->
    @dispatch level.WARNING, array_make(arguments)
  log: ->
    @dispatch level.LOG, array_make(arguments)
  post: (type, message) ->
    @dispatch type, [message]

class LoggerRepository
  constructor: ->
    return LoggerRepository.make()
  @make: ->
    logger ?= new Logger
  @enable: ->
    enabled = true
  @disable: ->
    enabled = false
  @status: ->
    enabled

if exports?
  module.exports = LoggerRepository if module? and module.exports
  root.Logger = LoggerRepository
else
  root.Javie = {} unless root.Javie?
  root.Javie.Logger = LoggerRepository

###
 * ==========================================================
 * Javie.Request
 * ==========================================================
 *
 * Request Helper for Client-side JavaScript
 *
 * @package Javie
 * @class   Request
 * @require underscore, jQuery/Zepto
 * @version 1.1.3
 * @since   0.1.1
 * @author  Mior Muhammad Zaki <https://github.com/crynobone>
 * @license MIT
 * ==========================================================
###

root = exports ? @
requests = {}
dispatcher = null

if typeof root.Javie is 'undefined'
  throw new Error "Javie is missing"
if typeof root.Javie.EventDispatcher is 'undefined'
  throw new Error "Javie.EventDispatcher is missing"

dispatcher = root.Javie.EventDispatcher.make()

_ = root._
_ = require('underscore') if !_ and require?

unless _
  throw new Error "underscore.js is missing"

api = root.$

if typeof api is 'undefined' or api is null
  throw new Error "Required jQuery or Zepto object is missing"

find_request = (name) ->
  request = null

  unless _.isUndefined(requests[name])
    parent = requests[name]

    if parent.executed is yes
      child_name = _.uniqueId "#{name}_"
      child = new Request

      dispatcher.clone("Request.onError: #{name}").to("Request.onError: #{child_name}")
      dispatcher.clone("Request.onComplete: #{name}").to("Request.onComplete: #{child_name}")
      dispatcher.clone("Request.beforeSend: #{name}").to("Request.beforeSend: #{child_name}")

      child.put parent.config
      request = child

    request = parent
  else
    request = new Request
    request.config = _.defaults request.config, RequestRepository.config
    request.put { 'name': name }
    requests[name] = request

  request

json_parse = (data) ->
  if _.isString(data) is yes
    try
      data = api.parseJSON data
    catch e
      # do nothing

  data

class Request
  executed: false
  response: null
  config:
    'name': ''
    'type': 'GET'
    'uri': ''
    'query': ''
    'data': ''
    'dataType': 'json'
    'id': ''
    'object': null
  get: (key, alt) ->
    return @config[key] if typeof @config[key] isnt 'undefined'

    alt ?= null
  put: (key, value) ->
    config = key
    unless _.isObject(key)
      config = {}
      config[key] = value

    @config = _.defaults config, @config
  to: (url, object, data_type) ->
    @put { 'dataType': data_type ?= 'json' }
    request_method = ['POST', 'GET', 'PUT', 'DELETE']

    if _.isUndefined(url)
      throw new Error "Missing required url parameter"

    unless object?
      object = root.document

    @put { 'object': object }

    segment = url.split ' '

    if segment.length is 1
      uri = segment[0]
    else
      if _.indexOf(request_method, segment[0]) isnt -1
        type = segment[0]

      uri = segment[1]

      if type isnt 'GET'
        queries = uri.split '?'

        if queries.length > 1
          url = queries[0]
          @put { 'query': queries[1] }

      uri = uri.replace ':baseUrl', @get('baseUrl', '')
      @put
        'type': type
        'uri': uri

    id = api(object).attr('id')
    @put { 'id': "##{id}" } if typeof id isnt 'undefined'

    @
  execute: (data) ->
    me = @

    name = @get 'name'

    unless _.isObject(data)
      data = "#{api(@get('object')).serialize()}&#{@get('query')}"
      data = '' if data is '?&'

    @executed = true

    dispatcher.fire 'Request.beforeSend', [@]
    dispatcher.fire "Request.beforeSend: #{name}", [@]
    @config['beforeSend'] @

    request =
      'type': @get 'type'
      'dataType': @get 'dataType'
      'url': @get 'uri'
      'data': data
      'complete': (xhr) ->
        data = json_parse xhr.responseText
        status = xhr.status
        me.response = xhr

        if !_.isUndefined(data) and data.hasOwnProperty('errors')
          dispatcher.fire 'Request.onError', [data.errors, status, me]
          dispatcher.fire "Request.onError: #{name}", [data.errors, status, me]
          me.config['onError'] data.errors, status, me
          data.errors = null

        dispatcher.fire 'Request.onComplete', [data, status, me]
        dispatcher.fire "Request.onComplete: #{name}", [data, status, me]
        me.config['onComplete'] data, status, me

        true

    api.ajax request

    @

class RequestRepository
  constructor: (name) ->
    return RequestRepository.make name
  @make: (name) ->
    name = 'default' unless _.isString(name)

    find_request name
  @config:
    'baseUrl': null
    'onError': (data, status) ->
    'beforeSend': (data, status) ->
    'onComplete': (data, status) ->
  @get: (key, alt) ->
    alt ?= null
    return alt if _.isUndefined(@config[key])

    @config[key]
  @put: (key, value) ->
    config = key
    unless _.isObject(key)
      config = {}
      config[key] = value

    @config = _.defaults config, @config

if exports?
  module.exports = RequestRepository if module? and module.exports
  root.Request = RequestRepository
else
  root.Javie.Request = RequestRepository

import Events from '../events/Events.es6'
import configuration from '../config/Config.es6'
import * as Util from '../../helpers'

let dispatcher = Events.make()
let requests = {}
let _ = require('../../vendor/underscore')
let api = require('../../vendor/jquery')

function json_parse(data) {
  if (_.isString(data)) {
    try {
      data = api.parseJSON(data)
    } catch (e) {
      data = null
    }
  }

  return data
}

class Handler {
  constructor() {
    this.executed = false
    this.response = null
    this.config = new Configuration({
      name: '',
      type: 'GET',
      uri: '',
      query: '',
      data: '',
      dataType: 'json',
      id: '',
      object: null,
      headers: {},
      beforeSend: () => {},
      onComplete: () => {},
      onError: () => {}
    })
  }

  get(key, defaults = null) {
    return this.config.get(key, defaults)
  }

  put(key, value) {
    return this.config.put(key, value)

    return this
  }

  addHeader(key, value) {
    let headers = this.config.get('headers', {})
    headers[key] = value
    this.config.put({ headers: headers })

    return this
  }

  to(url, object, dataType = 'json', headers = {}) {
    let supported = ['POST', 'GET', 'PUT', 'DELETED']

    if (_.isUndefined(url))
      throw new Error("Missing required URL parameter.")

    if (object == null)
      object = window.document

    let segment = url.split(' ')
    let uri = url
    let type = this.config.get('type', 'POST')
    let query = this.config.get('query', '')

    if (segment.length == 1) {
      uri = segment[0]
    } else {
      if (_.indexOf(supported, segment[0]) > -1)
        type = segment[0]

      uri = segment[1]
    }

    if (type != 'GET') {
      let queries = uri.split('?')

      if (queries.length > 1) {
        uri = queries[0]
        query = queries[1]
      }
    }

    uri = uri.replace(':baseUrl', this.config.get('baseUrl', ''))

    this.config.put({
      dataType: dataType,
      object: object,
      query: query,
      type: type,
      uri: uri,
      headers: headers
    })

    let id = api(object).attr('id')

    if (typeof id != 'undefined')
      this.config.put({ id: `#${id}` })

    return this
  }

  execute(data) {
    let me = this
    let name = this.config.get('name')
    let object = this.config.get('object')
    let query = this.config.get('query')

    if (!_.isObject(data)) {
      data =`${api(object).serialize()}&${query}`
      if (data == '?&') data = ''
    }

    this.executed = true

    let payload = {
      type: this.config.get('type'),
      dataType: this.config.get('dataType'),
      url: this.config.get('uri'),
      data: data,
      headers: this.config.get('headers', {}),
      beforeSend: function (xhr) {
        me.fireEvent('beforeSend', name, [me, xhr])
      },
      complete: function (xhr) {
        data = json_parse(xhr.responseText)
        status = xhr.status
        me.response = xhr

        if (!_.isUndefined(data) && data.hasOwnProperty('error')) {
          me.fireEvent('onError', name, [data.errors, status, me, xhr])
          data.errors = null
        }

        me.fireEvent('onComplete', name, [data, status, me, xhr])
      }
    }

    api.ajax(payload)

    return this
  }

  fireEvent(type, name, args) {
    dispatcher.fire(`Request.${type}`, args)
    dispatcher.fire(`Request.${type}: ${name}`, args)

    let callback = this.config[type]

    if (_.isFunction(callback))
      callback.apply(this, args)
  }
}

let RequestAttributes = {
  baseUrl: null,
  onError: (data, status) => {},
  beforeSend: (data, status) => {},
  onComplete: (data, status) => {}
}

class Request {
  constructor(name) {
    return Request.make(name)
  }

  static make(name = 'default') {
    return Request.find(name)
  }

  static get(key, defaults = null) {
    if (!_.isUndefined(RequestAttributes[key]))
      return RequestAttributes[key]

    return defaults
  }

  static put(key, value) {
    let config = key

    if (!_.isObject(key)) {
      config = {}
      config[key] = value
    }

    RequestAttributes = _.defaults(config, RequestAttributes)
  }

  static find(name) {
    let request = null

    if (_.isUndefined(requests[name])) {
      request = new Handler()
      request.put(_.defaults(request.config.all(), RequestAttributes))
      request.put({ name: name })

      return requests[name] = request
    }

    request = requests[name]

    if (!request.executed)
      return request

    let key = _.uniqueId(`${name}_`)
    let child = new Handler()

    dispatcher.clone(`Request.onError: ${name}`).to(`Request.onError: ${name}`)
    dispatcher.clone(`Request.onComplete: ${name}`).to(`Request.onComplete: ${name}`)
    dispatcher.clone(`Request.beforeSend: ${name}`).to(`Request.beforeSend: ${name}`)

    child.put(request.config)

    return child
  }
}

export default Request

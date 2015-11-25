import _ from '../../vendor/underscore'

class Configuration {
  constructor(attributes = {}) {
    this.attributes = attributes
  }

  has(key) {
    return !_.isUndefined(this.attributes[key])
  }

  get(key, defaults = null) {
    return this.has(key) ? this.attributes[key] : defaults
  }

  put(key, value) {
    let config = key

    if (!_.isObject(key)) {
      config = {}
      config[key] = value
    }

    this.attributes = _.defaults(config, this.attributes)
  }

  all() {
    return this.attributes
  }
}

export default Configuration

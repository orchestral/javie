'use strict'

global._ = require('underscore')

describe('Events', function () {
    var Events = require(__dirname+'/../src/modules/events/Events.es6')
    var events = new Events

    events.listen('javie.done', function () {
        return 'javie.done-emitted'
    })

    events.listen('javie.done', function () {
        return 'javie.done-again'
    })

    it('should be able to fire `javie.done`', function (done) {
        var response = events.fire('javie.done')

        if (response.length === 2) {
            done()
        }
    })

    it('should be able to run only first event `javie.done`', function (done) {
        var response = events.first('javie.done')

        if (response === 'javie.done-emitted') {
            done()
        }
    })

    it('should be able to flush `javie.done`', function (done) {
        events.flush('javie.done')
        if (events.fire('javie.done') === null) {
            done()
        }
    })
})

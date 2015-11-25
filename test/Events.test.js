import Events from '../src/modules/events/Events.es6'

describe('Events', function () {
    var dispatcher = new Events

    dispatcher.listen('javie.done', function () {
        return 'javie.done-emitted'
    })

    dispatcher.listen('javie.done', function () {
        return 'javie.done-again'
    })

    it('should be able to fire `javie.done`', function (done) {
        var response = dispatcher.fire('javie.done')

        if (response.length === 2) {
            done()
        }
    })

    it('should be able to run only first event `javie.done`', function (done) {
        var response = dispatcher.first('javie.done')

        if (response === 'javie.done-emitted') {
            done()
        }
    })

    it('should be able to flush `javie.done`', function (done) {
        dispatcher.flush('javie.done')
        if (dispatcher.fire('javie.done') === null) {
            done()
        }
    })
})

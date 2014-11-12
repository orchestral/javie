'use strict';

describe('Javie.EventDispatcher', function () {
    var EventDispatcher, events;

    EventDispatcher = require(__dirname+'/../src/modules/events/events.js');
    events = new EventDispatcher;
    console.log(events.listen);

    events.listen('javie.done', function () {
        return 'javie.done-emitted';
    });

    events.listen('javie.done', function () {
        return 'javie.done-again';
    });

    it('should be able to fire `javie.done`', function (done) {
        var response = events.fire('javie.done');

        if (response.length === 2) {
            done();
        }
    });

    it('should be able to run only first event `javie.done`', function (done) {
        var response = events.first('javie.done');

        if (response === 'javie.done-emitted') {
            done();
        }
    });

    it('should be able to flush `javie.done`', function (done) {
        events.flush('javie.done');
        if (events.fire('javie.done') === null) {
            done();
        }
    });
});

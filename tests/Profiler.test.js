'use strict'

global._ = require('underscore')

describe('Profiler', function () {
    var Profiler, stub;

    Profiler = require(__dirname+'/../src/modules/profiler/Profiler.es6')
    stub = Profiler.make()

    it('should return status true when Profiler is enabled', function (done) {
        Profiler.enable()

        if (Profiler.status() === true) {
            done()
        }
    })

    it('should return status false when Profiler is disabled', function (done) {
        Profiler.disable()

        if (Profiler.status() === false) {
            done()
        }
    })
})

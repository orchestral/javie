import Profiler from '../src/modules/profiler/Profiler.es6'

describe('Profiler', function () {
    var stub = Profiler.make()

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

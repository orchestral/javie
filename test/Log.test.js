import Log from '../src/modules/log/Log.es6'

describe('Log', function () {
    var writer = new Log

    it('should return status true when logger is enabled', function (done) {
        Log.enable()

        if (Log.status() === true) {
            done()
        }
    });

    it('should return status false when Logger is disabled', function (done) {
        Log.disable()

        if (Log.status() === false) {
            done()
        }
    });

    it('should be able to Log::info', function (done) {
        Log.enable()

        try {
            if (writer.info('echoed!')) {
                done()
            }
        } catch (e) {}
    });

    it('should be able to Log::debug', function (done) {
        Log.enable()

        try {
            if (writer.debug('echoed!')) {
                done()
            }
        } catch (e) {}
    });

    it('should be able to Log::warning', function (done) {
        Log.enable()

        try {
            if (writer.warning('echoed!')) {
                done()
            }
        } catch (e) {}
    });

    it('should be able to Log::log', function (done) {
        Log.enable()

        try {
            if (writer.log('echoed!')) {
                done()
            }
        } catch (e) {}
    });

    it('should be able to Log::other', function (done) {
        Log.enable()

        try {
            if (writer.post('foo', 'echoed!')) {
                done()
            }
        } catch (e) {}
    });
});

describe('Javie.Logger', function () {
    var Logger, stub;

    Logger = require(__dirname+'/../src/modules/logger/logger.js');
    stub = new Logger;

    it('should return status true when logger is enabled', function (done) {
        Logger.enable();

        if (Logger.status() === true) {
            done();
        }
    });

    it('should return status false when Logger is disabled', function (done) {
        Logger.disable();

        if (Logger.status() === false) {
            done();
        }
    });

    it('should be able to Logger::info', function (done) {
        Logger.enable();

        try {
            if (stub.info('echoed!')) {
                done();
            }
        } catch (e) {}
    });

    it('should be able to Logger::debug', function (done) {
        Logger.enable();

        try {
            if (stub.debug('echoed!')) {
                done();
            }
        } catch (e) {}
    });

    it('should be able to Logger::warning', function (done) {
        Logger.enable();

        try {
            if (stub.warning('echoed!')) {
                done();
            }
        } catch (e) {}
    });

    it('should be able to Logger::log', function (done) {
        Logger.enable();

        try {
            if (stub.log('echoed!')) {
                done();
            }
        } catch (e) {}
    });

    it('should be able to Logger::other', function (done) {
        Logger.enable();

        try {
            if (stub.post('foo', 'echoed!')) {
                done();
            }
        } catch (e) {}
    });
});

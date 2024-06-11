import _ from 'lodash';
var winston = require('winston');

var options = {
    console: {
        level: process.env.LOG_LEVEL || 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        prettyPrint: function (object) {
            object && delete object.password;
            _.omit(object, ['password']);
            _.omit(object, ['file']);
            return JSON.stringify(object);
        }
    },
};

var logger = new winston.Logger({
    transports: [
        // new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
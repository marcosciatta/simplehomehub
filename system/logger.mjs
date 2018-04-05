'use strict';
import _ from 'lodash';
import winston from 'winston';

const winstonInstance = new (winston.Logger)({
//const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            json: false,
            colorize: true
        })
    ]
});


class Logger {
    constructor(name = 'core'){
        this.categoryNameBase = name;

        // shared transports here
        winston.loggers.options.transports = [
            new winston.transports.Console({
                name: this.categoryNameBase,
                level: 'debug',
                colorize: true,
                showLevel: true,
                handleExceptions: true,
                humanReadableUnhandledException: true,
                label: this.categoryNameBase
            })
        ];

        this.logger = new winston.Logger({
            filters: [function (level, msg, meta) {
                return (level === 'info') ?  (new Date()).toTimeString() + ' --- ' + msg : msg;
            }],
            exitOnError: false
        });

        return this.get(name);
    }

    get(name){
        if(!_.isUndefined(name) || (this.categoryNameBase === 'core')){
            return winston.loggers.get(name);
        }else{
            return this.logger;
            //return winston.loggers.get(this.categoryNameBase);
        }

    }

    addCategory(name){
        winston.loggers.add(name, {
            console: {
                level: 'debug',
                colorize: true,
                label: name
            }
        });
    }
}

export { winstonInstance as default, Logger }

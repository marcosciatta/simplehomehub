import _ from 'lodash';
import glob from "glob";
import {Logger} from './system/logger';
import container from './system/dicontainer';
import systemConfig from './system.config';
import {start_application} from "./system/api";
import mongoose from 'mongoose';
import util from 'util';
import redis from 'redis';
import awilix from 'awilix';


let logger = new Logger('system');
let componentRegistry = container.resolve('componentRegistry');
let messagebus = container.resolve('messagebus');


logger.info('Start system...');

logger.info('initializing database...');

const mongoUri = systemConfig.MONGO_URI;
logger.debug(`Connecting to mongo on ${mongoUri}`);

mongoose.connect(mongoUri,{ server: { socketOptions: { keepAlive: 1}}});
mongoose.connection.on('error',() => {
    throw new Error(`unable to connect to database: ${mongoUri}`)
});

if(systemConfig.MONGOOSE_DEBUG){
    mongoose.set('debug',(collectionName, method, query, doc) => {
        logger.debug(`${collectionName}.${method}`,util.inspect(query,false,20),doc);
    })
}



logger.info('Initializing store...');
let store = redis.createClient(systemConfig.REDIS_URI);
store.on('error', (err) =>  {
    logger.error('Error in store initialization');
});
container.register({store: awilix.asValue(store)});


logger.info('Initializing plugins...');
glob('./components/*/*.*js', function (er, files) {
    _.forEach(files, function (file) {
        import(file)
            .then(obj => {
                logger.debug('Load plugin [' + obj.default.registerInfo().id + ']');
                componentRegistry.registerComponent(obj.default.registerInfo().id, obj.default);
            })
            .catch((error) => {
                console.log(error);
            });
    });
});


start_application();
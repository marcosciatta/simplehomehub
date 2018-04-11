import express from 'express';
import bodyParser from 'body-parser';
import compRouter from '../apis/components';
import systemConfig from "../system.config";
import container from "./dicontainer";
import {GenericEvent} from "./events.mjs";
import homeRouter from '../apis/home';

const logger = new (container.resolve('logger'))('Express');
const messagebus = container.resolve('messagebus');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




app.use('/api/components', compRouter);
app.use('/api/home',homeRouter);


function start_application() {
    app.listen(systemConfig.APP_PORT, () => {
        logger.debug('application started');
        messagebus.publish(new GenericEvent('system', 'application/started', {}));
        logger.info(`server started on port ${systemConfig.APP_PORT} (${systemConfig.NODE_ENV})`); // eslint-disable-line no-console
    }).on('error', function (err) {
        logger.error('on error handler');
        logger.error(err);
    });
    process.on('uncaughtException', function (err) {
        logger.error('process.on handler');
        logger.error(err);
    });
}

export {app as default, start_application};

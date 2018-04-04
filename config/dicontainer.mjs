import awilix from 'awilix';
import events from 'events';
import { Logger } from './logger.mjs';
import MessageBus from './messagebus.mjs';
import PluginRegistry from '../system/pluginRegistry.mjs';
import Home from '../system/home.mjs';
import postal from 'postal';
const asClass = awilix.asClass;
const asValue = awilix.asValue;
const createContainer = awilix.createContainer;
const Lifetime = awilix.Lifetime
const InjectionMode = awilix.InjectionMode;
const listModules = awilix.listModules;

const container = createContainer();
const ee = events.EventEmitter;

let logger = new Logger('di');
container.register({
    ee: asClass(ee).singleton(),
    logger: asValue(Logger),
    postal: asValue(postal),
    messagebus: asClass(MessageBus).singleton(),
    pluginRegistry: asClass(PluginRegistry).singleton(),
    home: asClass(Home).singleton()
});
logger.info('Initializing container...');

logger.debug('Current injected services: ' + listModules.length);
export default container;

import awilix from 'awilix';
import events from 'events';
import { Logger } from './logger.mjs';
import MessageBus from './messagebus.mjs';
import ComponentRegistry from './componentRegistry.mjs';
import Home from './home.mjs';
import postal from 'postal';
import IdentityProvider from './utils/identityProvider';

const asClass = awilix.asClass;
const asValue = awilix.asValue;
const asFunction = awilix.asFunction;
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
    componentRegistry: asClass(ComponentRegistry).singleton(),
    home: asClass(Home).singleton(),
    identityProvider: asValue(IdentityProvider)
});
logger.info('Initializing container...');

logger.debug('Current injected services: ' + listModules.length);
export default container;

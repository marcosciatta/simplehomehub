import awilix from 'awilix';
import events from 'events';
import postal from 'postal';
import { Logger } from './logger.mjs';
import MessageBus from './messagebus.mjs';
import ComponentRegistry from '../system/componentRegistry.mjs';
import Home from '../system/home.mjs';

//import philipsHue from '../applaiances/hue/philipsHue.mjs';

const asClass = awilix.asClass;
const asValue = awilix.asValue;
const createContainer = awilix.createContainer;
const Lifetime = awilix.Lifetime
const InjectionMode = awilix.InjectionMode;
const listModules = awilix.listModules;

const container = createContainer();
const ee = events.EventEmitter;

container.register({
    ee: asClass(ee).singleton(),
    postal: asValue(postal),
    logger: asClass(Logger),
    messagebus: asClass(MessageBus).singleton(),
    componentRegistry: asClass(ComponentRegistry).singleton(),
    home: asClass(Home).singleton()
});


let logger = new Logger('di');
logger.debug('Current injected services: ' + listModules.length);
export default container;

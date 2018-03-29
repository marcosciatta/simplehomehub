import awilix from 'awilix';
import events from 'events';
import postal from 'postal';

const asClass = awilix.asClass;
const asValue = awilix.asValue;
const createContainer = awilix.createContainer;

const container = createContainer();
const ee = events.EventEmitter;

container.register({
    ee: asClass(ee).singleton(),
    postal: asValue(postal)
});

export default container;

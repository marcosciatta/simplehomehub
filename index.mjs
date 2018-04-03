import systemCfg from './system.config';
import { Logger } from './config/logger.mjs';
import container from './config/dicontainer';
import Light from './devices/light';
import Home from './system/home';
import awilix from 'awilix';
const listModules = awilix.listModules;

import Hue from './components/hue/hue.mjs';

let logger = new Logger('system');
let postal = container.resolve('postal');
let componentRegistry = container.resolve('componentRegistry');

//Inizializing home
logger.info('Initializing Home...');
let home = new Home();

//Register plugins. (statically for now');
logger.info('Register plugins...');
componentRegistry.registerComponent('hue',Hue);
console.log(componentRegistry.getComponents(componentRegistry.typeApplaiance));
console.log('LAUNCH RESOLVE IN INDEX');
let hue = container.resolve('hue');


let light = new Light('light1','hue','on');
light.off();


let services = [];
services = hue.registerServices();
console.log('SERVICES');
console.log(services);
services['turn_on_device']({test:'prova'});





import app from './config/app.mjs';

//Create express api path
app.listen(systemCfg.APP_PORT, () => {
  console.log('app.start');
  postal.channel('system').publish('app.started',{});
  logger.info(`server started on port ${systemCfg.APP_PORT} (${systemCfg.NODE_ENV})`); // eslint-disable-line no-console
}).on('error', function(err){
    console.log('on error handler');
    console.log(err);
});




process.on('uncaughtException', function(err) {
    console.log('process.on handler');
    console.log(err);
});

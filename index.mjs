import _ from 'lodash';
import glob from "glob";
import systemCfg from './system.config';
import { Logger } from './system/logger';
import container from './system/dicontainer';
import {DeviceStateChangeEvent} from './system/events';
import deepEqual from 'deep-equal';

let logger = new Logger('system');
let componentRegistry = container.resolve('componentRegistry');
let messagebus = container.resolve('messagebus');

logger.info('Start system...');
logger.info('Initializing plugins...');

glob('./components/*/*.*js',function(er,files){
  _.forEach(files,function(file){
    import(file)
    .then(obj => {
      logger.debug('Load plugin ['+ obj.default.registerInfo().id+']');
      componentRegistry.registerPlugin(obj.default.registerInfo().id,obj.default);
    })
    .then(() => {
        //Try the install step
        logger.info('Install Hue component');
        let hue = componentRegistry.getComponent('hue');
        hue.install();
        /*
        logger.info('Turn on hue light explicit');
        let home = container.resolve('home');
        let light = home.getDevice('light001');
        logger.debug('Light state is '+ light.getCurrentState());
        light.on();
        logger.debug('Light state is '+ light.getCurrentState());
        //light.off();

        logger.info('Turn off hue light with event');
        logger.debug('Light state is '+ light.getCurrentState());
        messagebus.publish(new DeviceStateChangeEvent(light.identity,'home','off'));
        logger.debug('Light state is '+ light.getCurrentState());


        console.log();
        logger.info('Waiting from pull from hue compoent');
        console.log();
        hue.pullData();


        logger.debug('Get all available actions for componentRegistry');
        logger.debug(JSON.stringify(Array.from(componentRegistry.getActions())))
        logger.debug('Try to call action pragmatically');
        home.doAction('hue.set_scene',{scene_id: 1,prova:'test'});*/

    }).catch((error) => {
      console.log(error);
    });
  });
})

//Try to install fake hue device

//Register new light (dovrebbe farlo il component hue ad esempio)
//let light = new Light('light1','hue','on');
//light.off();


//Questa parte va definita per bene...
//1) I servizi dovrebbero registrarsi in automatico
//2) Le azioni idem in qualche parte (stesso container di, altro container, quando registri un component in component registry ?? il component registry non dovrebbe esistere? ahhhhhrrrghhhh)

//let services = [];
//let hue = container.resolve('hue');
//services = hue.registerServices();
//services['set_scene']({test:'prova'});



//App Da spostare!!
//import app from './config/app.mjs';

/*app.listen(systemCfg.APP_PORT, () => {
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
*/

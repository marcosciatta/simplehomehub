import systemCfg from './system.config';
import { Logger } from './config/logger';
import container from './config/dicontainer';
import _ from 'lodash';
import glob from "glob";

let logger = new Logger('system');
let pluginRegistry = container.resolve('pluginRegistry');


logger.info('Start system...');
logger.info('Initializing plugins...');

glob('./plugins/*/*.*js',function(er,files){
  _.forEach(files,function(file){
    import(file).then(obj => {
      logger.debug('Load plugin ['+ obj.default.registerInfo().id+']');
      pluginRegistry.registerPlugin(obj.default.registerInfo().id,obj.default);
    });
  });
});

//Register plugins. (should be dynamic)
//logger.info('Register plugins...');
//componentRegistry.registerComponent('hue',Hue);
//console.log(componentRegistry.getComponents(componentRegistry.typeApplaiance));


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

import app from './config/app.mjs';
import systemCfg from './system.config';
import { Logger } from './config/logger.mjs';
import container from './config/dicontainer';
import Home from './system/home';
import awilix from 'awilix';
const listModules = awilix.listModules;


let logger = new Logger('system');
let postal = container.resolve('postal');

//TEST
postal.subscribe({
  channel: 'device',
  topic: 'change-state-event',
  callback: function (data, envelope){
    console.log('['+data.device_identity+'] from :  ' + data.event.from);
    console.log('['+data.device_identity+'] from :  ' + data.event.to);
  }
});

//Example code
//create two switches
import Switch from './devices/switch'
let mySwitch = new Switch('switch1','on');
let mySwitch2 = new Switch('switch2','on');

//create a new light bulb
import Bulb from './devices/Bulb'
let light1 = new Switch('light1','on');

//Inizializing home
logger.info('Initializing Home...');
let home = new Home();


logger.info('Check Module registration...');

logger.debug('get Hue module');
let hue = container.resolve('hue');
logger.debug('loaded ' + hue.getName());


//Add the devices to home
home.addDevice(mySwitch);
home.addDevice(mySwitch2);
home.addDevice(light1);

home.getDevice('switch1').off();

//Create a simple rule using event system
/*import RuleEngine from './system/ruleengine';
import Rule from './system/rule';

let rule_expr = {
  trigger: {
    type: 'event',
    name: 'change-state-event',
    with: {
      device_identity: 'switch1',
      state: 'off'
    }
  },
  result:[ {
    type: 'event',
    name: 'change-state-to-event',
    with: {
      device_identity: 'switch2',
      state: 'off'
    }
  },
  {
    type: 'event',
    name: 'change-state-to-event',
    with: {
      device_identity: 'light1',
      state: 'off'
    }
  }
  ]
}; */

/*let rule = new Rule('test_rule1',rule_expr);
let engine = new RuleEngine();
engine.addRule(rule); */



app.listen(systemCfg.APP_PORT, () => {
  console.log('app.start');
  postal.channel('system').publish('app.started',{});
  logger.info(`server started on port ${systemCfg.APP_PORT} (${systemCfg.NODE_ENV})`); // eslint-disable-line no-console
});

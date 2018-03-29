import app from './config/app.mjs';
import systemCfg from './system.config';
import { Logger } from './config/logger.mjs';
import container from './config/dicontainer';
import Home from './system/home';

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
console.log('Initializing Home');
let home = new Home();

//Add the devices to home
home.addDevice(mySwitch);
home.addDevice(mySwitch2);
home.addDevice(light1);

//Create a simple rule using event system
import RuleEngine from './system/ruleengine';
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
};

let rule = new Rule('test_rule1',rule_expr);
let engine = new RuleEngine();
engine.addRule(rule);


let switch1 = home.getDevice('switch1');
console.log('****************************************');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');
console.log('home lamp 1  in state [' + home.getDevice('light1').getCurrentState() + ' ]');
console.log('****************************************');
console.log();
console.log('-----------------------------------------');
console.log('shutdown switch 1');
console.log('-----------------------------------------');

switch1.off();

console.log();
console.log('****************************************');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');
console.log('home lamp 1  in state [' + home.getDevice('light1').getCurrentState() + ' ]');
console.log('****************************************');

app.listen(systemCfg.APP_PORT, () => {
  console.log('app.start');
  postal.channel('system').publish('app.started',{});
  logger.info(`server started on port ${systemCfg.APP_PORT} (${systemCfg.NODE_ENV})`); // eslint-disable-line no-console
});

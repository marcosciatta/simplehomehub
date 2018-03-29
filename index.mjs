import app from './config/app.mjs';
import systemCfg from './system.config';
import { Logger } from './config/logger.mjs';
import container from './config/dicontainer';
import Home from './system/home';
import { Engine } from 'json-rules-engine';

let logger = new Logger('system');
let postal = container.resolve('postal');

//TEST
postal.subscribe({
  channel: 'device',
  topic: 'change-state-event',
  callback: function (data, envelope){
    console.log('['+data.device+'] from :  ' + data.event.from);
    console.log('['+data.device+'] from :  ' + data.event.to);
  }
});

import Switch from './devices/switch'
let mySwitch = new Switch('switch1','on');
let mySwitch2 = new Switch('switch2','off');

import Bulb from './devices/Bulb'
let light1 = new Switch('light1','on');

console.log('Initializing Home');
let home = new Home();
home.addDevice(mySwitch);
home.addDevice(mySwitch2);
home.addDevice(light1);

console.log('Inizializing rule');

let engine = new Engine();

engine.addRule({
  conditions: {
    any: [{
      all: [{
        fact: 'device_1',
        operator: 'equal',
        value: 'off',
        path: '.state'
      }]
    }]
  },
  event: {
    type: 'turn_on_bulb_on',
    params: {
      device_id: 123
    }
  }
});
engine.addFact('device_1', function(params, almanac){
  return home.getDevice(almanac.factValue('device_1'));
});

let facts = { 'device_1': 'lincoln' }
engine.run(facts).then(function(events){ console.log(facts.device_1 + ' is a ' + events.map(event => event.params.message))});


console.log();
console.log();
console.log('myswitch1 created in state [' + mySwitch.getCurrentState() + ' ]');
console.log('myswitch2 created in state [' + mySwitch2.getCurrentState() + ' ]');
console.log('LIGHT1 created in state [' + light1.getCurrentState() + ' ]');
console.log();

console.log('TURN SWITCH1 OFF');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');
console.log('home LIGHT 1  in state [' + home.getDevice('light1').getCurrentState() + ' ]');
mySwitch.off();
console.log('myswitch1 created in state [' + mySwitch.getCurrentState() + ' ]');
console.log('myswitch2 created in state [' + mySwitch2.getCurrentState() + ' ]');
console.log('LIGHT1 created in state [' + light1.getCurrentState() + ' ]');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');
console.log('home Light1  in state [' + home.getDevice('light1').getCurrentState() + ' ]');
console.log();


console.log('TURN SWITCH1 ON');
mySwitch.on();
console.log('myswitch1 created in state [' + mySwitch.getCurrentState() + ' ]');
console.log('myswitch2 created in state [' + mySwitch2.getCurrentState() + ' ]');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');

console.log('TURN SWITCH1 ON');
mySwitch2.on();
console.log('myswitch1 created in state [' + mySwitch.getCurrentState() + ' ]');
console.log('myswitch2 created in state [' + mySwitch2.getCurrentState() + ' ]');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');

console.log('TURN SWITCH1 OFF');
mySwitch2.off();
console.log('myswitch1 created in state [' + mySwitch.getCurrentState() + ' ]');
console.log('myswitch2 created in state [' + mySwitch2.getCurrentState() + ' ]');
console.log('home switch 1  in state [' + home.getDevice('switch1').getCurrentState() + ' ]');
console.log('home switch 2  in state [' + home.getDevice('switch2').getCurrentState() + ' ]');


app.listen(systemCfg.APP_PORT, () => {
  console.log('app.start');
  postal.channel('system').publish('app.started',{});
  logger.info(`server started on port ${systemCfg.APP_PORT} (${systemCfg.NODE_ENV})`); // eslint-disable-line no-console
});

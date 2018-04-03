import baseDevice from './baseDevice'
import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';
import { DeviceStateChangedEvent } from '../system/events.mjs';

class SwitchableDevice extends baseDevice {

  constructor(identity,realm,defaultState = 'on'){
    super(identity,realm);

    this.messagebus = this.container.resolve('messagebus');
    this.machine = new StateMachine({
      init: this.defaultState,
      transitions: [
        { name: 'on', from: 'off', to: 'on' },
        { name: 'off', from: 'on', to: 'off'},
        { name: 'goto', from: '*', to: function(s) { return s } }
      ]
    });

    this.setState(defaultState);
    this.machine.observe({
      onTransition: (lifecycle) => {
        console.log('Launch message on state change '+ this.identity + ' ' + this.realm);
        //TRY TO ASYNC PROMISE CALLBACK
        this.messagebus.publish(new DeviceStateChangedEvent(this.identity,this.realm,lifecycle.from,lifecycle.to));
        //this.messagebus.request(new DeviceStateChangedEvent(this.identity,this.realm,lifecycle.from,lifecycle.to));
      }
    });
  }

    setState(state){
      this.machine.goto(state);
    }

    on(){
      this.machine.on();
    }

    off(){
      this.machine.off();
    }

    getCurrentState(){
      return this.machine.state;
    }

    getQuerable(){
      return {
        identity: this.identity,
        state: this.getCurrentState()
      }
    }

}

export default SwitchableDevice;

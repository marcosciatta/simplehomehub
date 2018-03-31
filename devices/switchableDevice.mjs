import baseDevice from './baseDevice'
import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';
import { deviceChangedStateEvt } from '../system/events.mjs';

class SwitchableDevice extends baseDevice {

  constructor(identity,defaultState = 'on'){
    super(identity);

    this.messagebus = this.container.resolve('messagebus');
    this.machine = new StateMachine({
      transitions: [
        { name: 'on', from: 'off', to: 'on' },
        { name: 'off', from: 'on', to: 'off'},
        { name: 'goto', from: '*', to: function(s) { return s } }
      ]
    });

    this.setState(defaultState);
    this.machine.observe({
      onTransition: (lifecycle) => {
        this.messagebus.pusblish(new deviceChangedStateEvt(this.identity,lifecycle.from,lifecycle.to));
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

export default Switch;

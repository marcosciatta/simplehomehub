import baseDevice from './baseDevice'
import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';

class SwitchableDevice extends baseDevice {

  constructor(identity,defaultState = 'on'){
    super(identity);

    this.postal = this.container.resolve('postal');
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
        this.postal.publish({channel:'device',topic: 'change-state-event', data: { device_identity: this.identity,state: lifecycle.to, event: lifecycle}});
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

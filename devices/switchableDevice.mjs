import baseDevice from './baseDevice'
import StateMachine from 'javascript-state-machine';
import container from '../system/dicontainer';

class SwitchableDevice extends baseDevice {

  constructor(identity,name,realm,defaultState = 'on',attributes = {},data){
    super(identity,name,realm,attributes,data);

    this.machine = new StateMachine({
      init: this.defaultState,
      transitions: [
        { name: 'on', from: 'off', to: 'on' },
        { name: 'off', from: 'on', to: 'off'},
        { name: 'goto', from: '*', to: function(s) { return s } }
      ]
    });

    this.setState(defaultState);
    /*this.machine.observe({
      onTransition: (lifecycle) => {
        this.messagebus.publish(new DeviceStateChangedEvent(this.identity,this.realm,lifecycle.from,lifecycle.to));
      }
    });*/
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


}

export default SwitchableDevice;

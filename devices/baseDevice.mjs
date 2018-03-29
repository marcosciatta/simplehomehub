import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';

class baseDevice {

  constructor(identity,defaultState){
    this.identity = identity;

    this.container = container;
    this.postal = this.container.resolve('postal');
    this.machine = new StateMachine({
      transitions: [
        { name: 'on', from: 'off', to: 'on' },
        { name: 'off', from: 'on', to: 'off'},
        { name: 'goto', from: '*', to: function(s) { return s } }
      ]
    });

    this.setState(defaultState);

    var self = this;
    this.machine.observe({
      onTransition: function(lifecycle){
        self.postal.publish({channel:'device',topic: 'change-state-event', data: { device: self.identity, event: lifecycle}});
      }
    });
  }

  init_off(){
    this.setState('off');
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

export default baseDevice;

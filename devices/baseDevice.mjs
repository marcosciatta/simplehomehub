import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';

class BaseDevice {

  constructor(identity,realm){
    this.realm = realm;
    this.identity = identity;
    this.container = container;
  }


}

export default BaseDevice;

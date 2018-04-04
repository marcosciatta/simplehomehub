import StateMachine from 'javascript-state-machine';
import container from '../config/dicontainer';

class BaseDevice {

  constructor(identity,realm){
    this.realm = realm;
    this.identity = identity;
    this.container = container;
    this.machine = null;
    this.attributes = new Map();
  }


  setAttribute(name,value){
    this.attributes.set(name,value);
  }

  getAttribute(name){
    if(this.attributes.has(name)){
      return this.attributes.get(name);
    }
    return undefined;
  }


}

export default BaseDevice;

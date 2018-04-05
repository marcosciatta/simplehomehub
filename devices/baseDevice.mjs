import StateMachine from 'javascript-state-machine';
import container from '../system/dicontainer';

class BaseDevice {

  constructor(identity,realm,attributes,data){
    this.realm = realm;
    this.identity = identity;
    this.container = container;
    this.machine = new StateMachine({});
    this.attributes = new Map(attributes);
    this.data = {};
  }

  getAvailableStates(){
    return this.machine.allStates();
  }

  getCurrentState(){
    return this.machine.state;
  }

  canDoOperation(op){
    this.machine.can(op);
  }

  getOperations(){
    return this.machine.transitions();
  }

  getAttributes(){
    return this.attributes.keys();
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

  toData(){
    return {
      identity: this.identity,
      state: this.getCurrentState(),
      attributes: this.attributes,
      realm: this.realm,
      data: this.data
    }
  }


}

export default BaseDevice;

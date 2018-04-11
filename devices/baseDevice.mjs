import StateMachine from 'javascript-state-machine';
import container from '../system/dicontainer';

class BaseDevice {

  constructor(identity,name,realm,attributes = {},data){
    this.realm = realm;
    this.name = name;
    this.identity = identity;
    this.machine = new StateMachine({});
    this.attributes = new Map();
    this.type = 'Unknown device';

    Object.keys(attributes).forEach(key => {
        this.attributes.set(key, attributes[key]);
    });
    console.log('DEVICE');
    console.log(data);
    this.data = data;
    this.av = true;
  }

  setAvailability(av){
    this.av = av;
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



  updateFromNewDeviceData(data){
    if(this.identity == data.identity){
      this.attributes = new Map(data.attributes);
      this.data = data.data;

    }
  }

  toData(){
      let attributes = Array.from(this.attributes).reduce((obj, [key, value]) => (
          Object.assign(obj, { [key]: value })
      ), {});
      return {
        identity: this.identity,
        realm: this.realm,
        type: this.type,
        name: this.name,
        state: this.getCurrentState(),
        attributes: attributes,
        data: this.data,
    }
  }


}

export default BaseDevice;

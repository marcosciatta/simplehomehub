import StateMachine from 'javascript-state-machine';
import container from '../system/dicontainer';
import _ from 'lodash';

const COM_TYPE_SYNC = 'SYNC';
const COM_TYPE_ASYNC = 'ASYNC';

class BaseDevice {

  constructor(identity,name,realm,attributes = {},data){
    this.realm = realm;
    this.name = name;
    this.identity = identity;
    this.machine = new StateMachine({});
    this.attributes = new Map();
    this.type = 'Unknown device';
    this.com_type = COM_TYPE_SYNC;

    Object.keys(attributes).forEach(key => {
        this.attributes.set(key, attributes[key]);
    });
    this.data = data;
    this.av = true;
  }

  static get COM_TYPE_ASYNC(){
    return COM_TYPE_ASYNC;
  }

  static  get COM_TYPE_SYNC(){
      return COM_TYPE_SYNC;
  }

  setComTypeAsync()
  {
    this.com_type = COM_TYPE_ASYNC;
  }

  getComType()
  {
    return this.com_type;
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

  supportAttributes(attributes){

    for (let attribute of _.keys(attributes)){
      if(!this.attributes.has(attribute)) return false;
    }
    return true;
  }

  setAttributes(attributes){
    for(let key of Object.keys(attributes)) {
        this.setAttribute(key, attributes[key]);
    }
  }

  setAttribute(attribute,value)
  {
    if(this.attributes.has(attribute)){
      this.attributes.set(attribute,value);
    }
  }



  updateFromNewDeviceData(data){
    if(this.identity == data.identity){
      this.attributes = new Map();
      Object.keys(data.attributes).forEach(key => {
          this.attributes.set(key, data.attributes[key]);
      });
      this.data = data.data;
      this.name = data.name;
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
        data: this.data
    }
  }


}

export default BaseDevice;

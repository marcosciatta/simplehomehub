import {DeviceAddedEvent,DeviceUpdatedEvent,DeviceChangedStateEvent} from './events';
import { deviceStateTraker } from './utils/deviceProxy';
import ObservableSlim  from 'observable-slim';
import _ from 'lodash';

class Home {
  constructor({logger,messagebus,componentRegistry}){
      this.devices = new Map;
      this.messagebus = messagebus;
      this.logger = new logger('Home');
      this.componentRegistry = componentRegistry;

      this.messagebus.subscribe({
            channel: 'home',
            topic: 'home.change.state',
            callback: (data, envelope) => { this.changeDeviceStateTo(data.identity,data.operation); }
      });
  }

  addDevice(id,device){
    this.logger.debug('Added device ['+id+']');

    if(this.devices.has(id)){
      return this.updateDevice(id,this.devices.get(id),device.toData());
    }
    this.devices.set(id,device);

    let evt = new DeviceAddedEvent(
      device.identity,
      device.realm,
      device.toData()
    );
    this.messagebus.publish(evt);
  }

  updateDevice(id,device,data){
    this.logger.debug(`update device id  ${id}`);
    let proxed = deviceStateTraker(device,(obj,prop,oldVal,newVal,changes) => {
      //this.logger.debug(JSON.stringify(changes));
    });

    proxed.updateFromNewDeviceData(data);

    let evt = new DeviceUpdatedEvent(
        device.identity,
        device.realm,
        device.toData()
    );
    this.messagebus.publish(evt);
  }

  getDevice(id){
    this.logger.debug('get device '+ id);
    if(this.devices.has(id)){
      return this.devices.get(id);
    }
    return false;
  }

  getDevices(){
    this.logger.debug('get devices');
    console.log(this.devices.values());
    return this.devices.values();
  }

  changeDeviceStateTo(identity,operation) {
    this.logger.debug('Change state to device ['+identity +'] to '+ operation);
    if(identity){
      let device = this.getDevice(identity);

      let evt = new DeviceChangedStateEvent(
        device.identity,
        device.realm,
        device.getCurrentState(),
        operation
      );

      device.setState(operation);
      this.messagebus.publish(evt);
    }
  }


  doAction(action,param = {test:'ciao'}){
    let [realm, call]=  _.split(action,'.');
    let component = this.componentRegistry.getComponent(realm);
    //let funcs = component.exposedFunction();
    /*console.log('exposed');
    console.log(funcs);
    let f = funcs.get('set_scene');
    console.log(f);
    component[f](param); */
    let actions = this.componentRegistry.getActionsFromComponent(realm);
    Reflect.apply(Reflect.get(actions,call),component,[param]);

  }
}

export default Home;

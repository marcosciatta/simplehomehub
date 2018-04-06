import {DeviceGenericEvent,DeviceStateChangedEvent} from './events';
import { deviceStateTraker } from './utils/deviceProxy';
import ObservableSlim  from 'observable-slim';
class Home {
  constructor({logger,messagebus}){
      this.devices = new Map;
      this.messagebus = messagebus;
      this.logger = new logger('Home');

      this.messagebus.subscribe({
            channel: 'home',
            topic: 'home.change.state',
            callback: (data, envelope) => { this.changeDeviceStateTo(data,envelope); }
      });
  }

  addDevice(id,device){
    this.logger.debug('Added device ['+id+']');

    if(this.devices.has(id)){
      this.updateDevice(id,this.devices.get(id),device.toData());
    }
    this.devices.set(id,device);

    let evt = new DeviceGenericEvent(
      device.identity,
      'device_added',
      device.realm,
      device.toData()
    );
    this.messagebus.publish(evt);
  }

  updateDevice(id,device,data){
    this.logger.debug(`update device id  ${id}`);
    let proxed = deviceStateTraker(device,(obj,prop,oldVal,newVal,changes) => {
      this.logger.debug(JSON.stringify(changes));
    });

    proxed.updateFromNewDeviceData(data);
    console.log(device.toData());
  }

  getDevice(id){
    this.logger.debug('get device '+ id);
    if(this.devices.has(id)){
      return this.devices.get(id);
    }
    return false;
  }

  changeDeviceStateTo(data, envelope) {
    this.logger.debug('Change state to device ['+data.identity +'] to '+ data.operation);
    if(data.identity){
      let device = this.getDevice(data.identity);

      let evt = new DeviceStateChangedEvent(
        device.identity,
        device.realm,
        device.getCurrentState(),
        data.operation
      );

      device.setState(data.operation);
      this.messagebus.publish(evt);
    }
  }
}

export default Home;

import _ from 'lodash';
import container from '../config/dicontainer';

class Home {

  constructor(){
      this.devices = new Map;
      this.container = container;

      //this.postal = this.container.resolve('messagebus');
      //this.postal.subscribe({
      //  channel: 'device',
      //  topic: 'change-state-to-event',
      //  callback: self.changeDeviceStateTo.bind(this)
      //});
  }

  addDevice(id,device){
    this.devices.set(id,device);
  }

  getDevice(device_identity){
    if(this.devices.has(id)){
      return this.devices.get(id);
    }
    return false;
  }

  changeDeviceStateTo(data, envelope) {
    if(data.device_identity){
      let device = this.getDevice(data.device_identity);
      device.setState(data.state);
    }
  }
}

export default Home;

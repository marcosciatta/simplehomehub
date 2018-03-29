import _ from 'lodash';
import container from '../config/dicontainer';

class Home {
  constructor(){
      this.devices = new Array();
      this.systemData = {};
      let self = this;
      this.container = container;
      this.postal = this.container.resolve('postal');
      this.postal.subscribe({
        channel: 'device',
        topic: 'change-state-to-event',
        callback: self.changeDeviceStateTo.bind(this)
      });
  }

  addDevice(device){
    this.devices.push(device);
  }

  getDevice(device_identity){
    let index = _.findIndex(this.devices, ['identity', device_identity]);
    return this.devices[index];
  }

  changeDeviceStateTo(data, envelope) {
    if(data.device_identity){
      let device = this.getDevice(data.device_identity);
      device.setState(data.state);
    }
  }

  systemSnapshot(){

  }


}

export default Home;

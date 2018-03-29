import _ from 'lodash';

class Home {
  constructor(){
      this.devices = new Array();
      this.systemData = {};
  }

  addDevice(device){
    this.devices.push(device);
  }

  getDevice(device_identity){
    let index = _.findIndex(this.devices, ['identity', device_identity]);
    return this.devices[index];
  }

  systemSnapshot(){

  }
}

export default Home;

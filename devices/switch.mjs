import switchableDevice from './switchableDevice'

class Switch extends switchableDevice {

  constructor(identity,defaultState = 'on'){
    super(identity,defaultState);
    this.type = 'switch';
  }
}

export default Switch;

import switchableDevice from './switchableDevice'

class Switch extends switchableDevice {

  constructor(identity,defaultState = 'on'){
    super(identity,defaultState);
    console.log('bulb created');
  }
}

export default Switch;

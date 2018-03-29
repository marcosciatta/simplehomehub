import baseDevice from './baseDevice'

class Switch extends baseDevice {

  constructor(identity,defaultState = 'on'){
    super(identity,defaultState);
    console.log('switch created');
  }

}

export default Switch;

import switchableDevice from './switchableDevice'

class Light extends switchableDevice {

  constructor(identity,realm,defaultState = 'on'){
    super(identity,realm,defaultState);
    console.log('bulb created');
  }

}

export default Light;

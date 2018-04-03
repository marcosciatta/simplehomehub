import switchableDevice from './switchableDevice'

class Light extends switchableDevice {

  constructor(identity,realm,defaultState = 'on'){
    super(identity,realm,defaultState);
  }

}

export default Light;

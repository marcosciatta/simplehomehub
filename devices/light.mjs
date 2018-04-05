import switchableDevice from './switchableDevice'

class Light extends switchableDevice {

  constructor(identity,realm,defaultState = 'on',attributes,data){
    super(identity,realm,defaultState,attributes,data);
  }

}

export default Light;

import switchableDevice from './switchableDevice'

class Bulb extends switchableDevice {

  constructor(identity,defaultState = 'on'){
    super(identity,defaultState);
    console.log('bulb created');
  }

}

export default Bulb;

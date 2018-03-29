import baseDevice from './baseDevice'

class Bulb extends baseDevice {

  constructor(identity,defaultState = 'on'){
    super(identity,defaultState);
    console.log('bulb created');
  }

}

export default Bulb;

import switchableDevice from './switchableDevice'

const DIMMERABLE = 'dimmerable';
const RGB_COLOR = 'rgbcolor';

class Light extends switchableDevice {

  constructor(identity,name,realm,defaultState = 'on',attributes,data){
    super(identity,name,realm,defaultState,attributes,data);
    this.type = 'light';
    this.supports = [];
  }

  static get DIMMERABLE(){
    return DIMMERABLE;
  }

  static get RBG_COLOR(){
    return RGB_COLOR;
  }

  toData(){
    let data = super.toData();
    data.supports = this.supports;
    return data;
  }
}

export default Light;

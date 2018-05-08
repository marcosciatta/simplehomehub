
import Light from './light'

class DimmableLight extends Light {

    constructor(identity,name,realm,defaultState = 'on',attributes,data){
        super(identity,name,realm,defaultState,attributes,data);
        this.type = 'light';
        this.supports = [Light.DIMMERABLE];
    }
}

export default DimmableLight;

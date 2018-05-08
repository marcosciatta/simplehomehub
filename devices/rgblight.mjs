import Light from './light'

class RbgLight extends Light {

    constructor(identity,name,realm,defaultState = 'on',attributes,data){
        super(identity,name,realm,defaultState,attributes,data);
        this.type = 'light';
        this.supports = [Light.RBG_COLOR, Light.DIMMERABLE];
    }


}

export default RbgLight;

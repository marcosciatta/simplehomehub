
import Light from './light'

class LightGroup extends Light {

    constructor(identity,name,realm,defaultState = 'on',attributes,data){
        super(identity,name,realm,defaultState,attributes,data);
        this.type = 'lightgroup';
    }


}

export default LightGroup;

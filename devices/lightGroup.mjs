
import Light from './light'

class LightGroup extends Light {

    constructor(identity,name,realm,defaultState = 'on',attributes,data){
        super(identity,name,realm,defaultState,attributes,data);
        this.type = 'lightGroup';
        this.supports = [Light.DIMMERABLE,Light.RBG_COLOR];
    }

}

export default LightGroup;

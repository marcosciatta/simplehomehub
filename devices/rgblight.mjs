import Light from './light'

class RbgLight extends Light {

    constructor(identity,name,realm,defaultState = 'on',attributes,colorstate,data){
        super(identity,name,realm,defaultState,attributes,data);
        this.colorstate = colorstate;
        this.type = 'rgblight';

    }

    setColorAttribute(colorstate){
        this.colorstate = colorstate;
    }

    getColorAttributes(){
        return this.colorstate;
    }

    toData(){
       let data =  super.toData();
       data.colorstate = this.colorstate;
       return data;
    }
}

export default RbgLight;

import _ from 'lodash';
import container from '../config/dicontainer';
import InjectionMode from 'awilix';
import awilix from 'awilix';
const asClass = awilix.asClass;
const asValue = awilix.asValue;
import Hue from '../components/hue/hue';

const typeApplaiance = 'applaiance';
const typeService = 'service';

class ComponentRegistry{

  constructor(ee){
    this.components = new Map;
    this.container = container;
  }

  static get typeApplaiance(){
    return typeApplaiance;
  }

  static get typeService() {
    return typeService;
  }

  registerComponent(name,comp){
    container.register({
      [name]: asClass(comp).singleton()
    });
  //  this.components.set(name, comp);
  }

  getComponents(type){
    if(type != '' || type != undefined){
      return(_.filter(Array.from(this.components.values()),{'type':'applaiance'}));
    } else return Array.from(this.components.values());
  }


}

export default ComponentRegistry;

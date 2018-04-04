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
    this.componentsMap = new Map;
    this.container = container;
    this.actionsMap = new Map();
  }

  static get typeApplaiance(){
    return typeApplaiance;
  }

  static get typeService() {
    return typeService;
  }

  registerComponent(name,comp){
    container.register({
      [name]: asClass(comp).singleton().setInjectionMode(InjectionMode.CLASSIC)
    });
    let instance = container.build(comp);
    this.componentsMap.set(name,comp.registerInfo());
    if(typeof instance.registerServices == 'function'){
        let services = _.keys(instance.registerServices());
        this.actionsMap.set(name,services);
    }
  }

  getComponents(type){
    if(type != '' || type != undefined){
      return(_.filter(Array.from(this.componentsMap.values()),{'type':'applaiance'}));
    } else return Array.from(this.componentsMap.values());
  }


}

export default ComponentRegistry;

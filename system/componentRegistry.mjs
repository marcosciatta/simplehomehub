import _ from 'lodash';
import container from '../system/dicontainer';
import InjectionMode from 'awilix';
import awilix from 'awilix';
const asClass = awilix.asClass;
const asValue = awilix.asValue;

const typeApplaiance = 'applaiance';
const typeService = 'service';

class ComponentRegistry{

  constructor(services){
    this.componentsMap = new Map;
    let logger = services.logger;
    this.logger = new logger('pluginRegistry');
    this.actionsMap = new Map();
  }

  static get typeApplaiance(){
    return typeApplaiance;
  }

  static get typeService() {
    return typeService;
  }

  registerPlugin(name,comp){
    this.logger.debug('Register plugin ['+name+']');
    container.register({
      [name]: asClass(comp).singleton()
    });
    //let instance = container.build(comp);
    let instance = comp;
    this.componentsMap.set(name,comp.registerInfo());
    if(typeof instance.registerServices == 'function'){
        let services = _.keys(instance.registerServices());
        this.logger.debug('Register services provided by ['+name +']');
        this.logger.debug(services);
        this.actionsMap.set(name,services);
    }
  }

  getComponent(name){
    return container.resolve(name);
  }

  getComponents(type){
    if(type != '' || type != undefined){
      return(_.filter(Array.from(this.componentsMap.values()),{'type':'applaiance'}));
    } else return Array.from(this.componentsMap.values());
  }


}

export default ComponentRegistry;

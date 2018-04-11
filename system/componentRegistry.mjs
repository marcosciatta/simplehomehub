import _ from 'lodash';
import container from '../system/dicontainer';
import InjectionMode from 'awilix';
import awilix from 'awilix';
import componentModel from '../models/components';

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
    let instance = container.resolve([name]);

    let component_info = comp.registerInfo();
    this.componentsMap.set(name,component_info);

    let services =instance.registerServices();
    this.actionsMap.set(name,services);


    this.logger.debug('Register services provided by ['+name +']');
    this.logger.debug(`Register action on ${name}: ${JSON.stringify(services)}`);
    componentModel.findOneAndUpdate({'id': component_info.id},component_info,{new: true, upsert: true, setDefaultsOnInsert: true})
        .then((doc,err) => {
          this.logger.debug(`Update information on plugin ${doc.id}`);
        })
  }

  getComponent(name){
    return container.resolve(name);
  }

  getComponents(type){
    if(type != '' || type != undefined){
      return(_.filter(Array.from(this.componentsMap.values()),{'type':'applaiance'}));
    } else return Array.from(this.componentsMap.values());
  }

  getActions(){
    return this.actionsMap;
  }

  getActionsFromComponent(name){
    return this.actionsMap.get(name);
  }

  installComponent(name){
    this.logger.info(`Launch installation process for ${name} component`);
    let component = this.getComponent(name);
    component.install()
        .then((response) => {
            return componentModel.findOneAndUpdate({'id':name},{installed: true,installed_at: Date.now()}).exec();
        })
        .then((response) => {
          this.logger.info(`Component ${name} installed!`);
        })
        .catch((error) =>{
          this.logger.error('Error in component installation!');
          console.log(error);
        });
  }

}

export default ComponentRegistry;

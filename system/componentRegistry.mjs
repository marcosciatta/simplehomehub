import _ from 'lodash';
import container from '../system/dicontainer';
import InjectionMode from 'awilix';
import awilix from 'awilix';
import componentModel from '../models/components';
import { SystemEvent } from './events';


const asClass = awilix.asClass;
const asValue = awilix.asValue;
const typeApplaiance = 'applaiance';
const typeService = 'service';

class ComponentRegistry{

  constructor(services){
    this.componentsMap = new Map;
    let logger = services.logger;
    this.logger = new logger('pluginRegistry');
    this.messagebus = services.messagebus;
    this.actionsMap = new Map();
  }

  static get typeApplaiance(){
    return typeApplaiance;
  }

  static get typeService() {
    return typeService;
  }

  registerComponent(name,comp){
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
          return doc;
        })
        .then((doc) => {
          this.messagebus.publish(new SystemEvent('component.registered',doc));
          return doc;
        })
        .then((doc) => {
          if(doc.installed){
              this.logger.info('Start component');
              instance.start();
          }
        });
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
        .then((response) => {
            this.messagebus.publish(new SystemEvent('component.installed',{'component_name': name} ));
        })
        .catch((error) =>{
          this.logger.error('Error in component installation!');
          console.log(error);
        });
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

}

export default ComponentRegistry;

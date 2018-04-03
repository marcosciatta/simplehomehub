import huejay from 'huejay';
import { Logger } from '../../config/logger.mjs';
import ComponentRegistry from '../../system/componentRegistry';
import container from '../../config/dicontainer';

class Hue {
  constructor(ee,messagebus){
    console.log('start hue component');
    this.container = container;
    this.messagebus = messagebus;
    this.messagebus = container.resolve('messagebus');
    this.logger = new Logger('Hue');
    this.messagebus.subscribe({
        channel: 'home',
        topic: 'hue.changed.state',
        callback: (data, envelope) => {
            console.log(this.messagebus);
            console.log('Shutdown lamp 1');
        }
    });
  }

  static registerInfo(){
    return {type: ComponentRegistry.typeApplaiance, name: 'Philips hue', 'icon': '/applaiances/hue.jpg','short_name': 'Philips Hue'};
  }

  install(){
    console.log('Install plugin!!!');
  }

  _discovery(){
    this.logger.debug('Starting brige installation...');
    huejay.discover()
      .then(bridges => {
        console.log(bridges);
        for (let bridge of bridges) {
          logger.info(`Found bridge to: Id: ${bridge.id}, IP: ${bridge.ip}`);
        }
      })
      .catch(error => {
        logger.info(`An error occurred: ${error.message}`);
      });
    this.logger.debug('Done bridge discovery');
  }

//awilikx (mi registro le azioni da qualche parte in un service container un array [nome oggetto , servizi],  non lo so)
//ui register services dell'instanza della classe.
//tv.setSchene()!!!!grandeeeee
  setSceneExample(param)
  {

    this.logger.info('In component service');
    this.logger.debug(param);
    this.logger.debug('With arrow function works!!!');
  }


  registerServices(){
    return {
      'set_scene': (param) => {this.setSceneExample(param) }
    }
  }


}
export default Hue;

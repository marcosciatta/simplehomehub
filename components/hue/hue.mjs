import huejay from 'huejay';
import { Logger } from '../../config/logger.mjs';
import ComponentRegistry from '../../system/componentRegistry';

class Hue {
  constructor(container){
    this.container = container;
    this.logger = new Logger('Hue');
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
}
export default Hue;

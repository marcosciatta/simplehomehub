import  huejay from 'huejay';
import container from '../../config/dicontainer.mjs';
import { Logger } from '../../config/logger.mjs';

class Hue {
  constructor(){
    this.container = container;
    this.logger = new Logger('Hue');
  }

  getName(){
    return 'Philips hue service';
  }

  discovery(){
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

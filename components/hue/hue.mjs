import huejay from 'huejay';
import BaseComponent from '../../system/baseComponent';
import  ComponentRegistry from '../../system/componentRegistry';
import Light from '../../devices/light';

const realm = 'hue';

class Hue extends BaseComponent {

  static get realm(){
    return realm;
  }

  constructor({messagebus,logger,componentRegistry,home}){
    super();
    this.messagebus = messagebus;
    this.home = home;

    this.logger = new logger('Hue');
    this.logger.debug('Start component');
    this.logger.debug('Register listeners');
    this.registerListeners();
  }

  static registerInfo(){
    return {id: 'hue', type: ComponentRegistry.typeApplaiance, name: 'Philips hue', 'icon': '/applaiances/hue.jpg','short_name': 'Philips Hue'};
  }

  registerServices(){
    return {
      set_scene: (param) => {this.setSceneExample(param) },
      delete_scene: (param) => { this.deleteScene(param) }
    }
  }


  pullData(){
    let device = new Light('light001',realm,'on',Object.entries({intencity: 40}),Object.entries({macaddress:123}));
    this.home.addDevice('light001',device);
  }

  registerListeners()
  {
    this.messagebus.subscribe({
        channel: 'home',
        topic: 'hue.changed.state',
        callback: (data, envelope) => {
            this.logger.debug('Recived message');
            this.logger.info('Shutdown lamp');
        }
    });
  }

  install(){
    this.logger.debug('Install component...');
    this.logger.debug('Creating one light device on realm ['+ realm+']');
    let device = new Light('light001',realm,'off',Object.entries({intencity: 20}),Object.entries({macaddress:123}));
    this.home.addDevice('light001',device);
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
        this.logger.info(`An error occurred: ${error.message}`);
      });
    this.logger.debug('Done bridge discovery');
  }

  setSceneExample(param)
  {

    this.logger.info('In component service');
    this.logger.debug(param);
    this.logger.debug('With arrow function works!!!');
  }

}
//export { Hue as Hue };
export default Hue;

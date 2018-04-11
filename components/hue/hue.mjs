import huejay from 'huejay';
import BaseComponent from '../../system/baseComponent';
import ComponentRegistry from '../../system/componentRegistry';
import Bridge from './utils/bridge';
import LightTranslator from './utils/translator';

const realm = 'hue';
const deviceType = 'shh1';


class Hue extends BaseComponent {

  constructor({messagebus,logger,componentRegistry,home,store}){
    super(messagebus,home,store);

    this.logger = new logger('Hue');
    this.bridge_ip = this.getStoreValue('hue_bridge_ip');
    this.hue_username = this.getStoreValue('hue_username');
    this.client = undefined;
    this.bridge = new Bridge(this.logger,deviceType);
  }

  static get realm(){
      return realm;
  }

  static registerInfo(){
    return {
      id: 'hue',
      type: ComponentRegistry.typeApplaiance,
      name: 'Philips hue',
      'icon': '/applaiances/hue.jpg',
      'short_name': 'Philips Hue'
    };
  }

  async start(){
      let bridge_user = await this.getStoreValue('hue_username');
      let bridge_ip = await this.getStoreValue('hue_bridge_ip');

      if(!bridge_user || !bridge_ip){
        throw new Error('Unable to start');
      }

      let bridge_options ={
        host: bridge_ip,
        username: bridge_user
      };

      this.client = new huejay.Client(bridge_options);

      let authenticatedUser = await this.bridge.getUser(this.client);
      this.logger.debug('Registring lights');
      this.registerLights(this.client);
  }


  async install(){

    this.logger.debug('Install component...');

    let bridge_user = await this.getStoreValue('hue_username');
    let bridge_ip = await this.getStoreValue('hue_bridge_ip');

    if(null == bridge_ip || bridge_ip == undefined){
        let bridge = await this.bridge.discovery();
        this.logger.debug(`Found bridge ${bridge.ip}`);
        this.setStoreValue('hue_bridge_ip',bridge.ip);
        bridge_ip = bridge.ip;
    }


    let bridge_options ={};
    bridge_options.host = bridge_ip;

    let client = new huejay.Client(bridge_options);

    if(bridge_user == undefined || bridge_user == null) {
        await this.waitUserConfirm();
        let user = await this.bridge.createUser(client);
        this.setStoreValue('hue_username',user.username);
    }
    this.start();
  }

  registerServices(){
      return {
          set_scene: (param) => {this.setSceneExample(param) },
          delete_scene: (param) => { this.deleteScene(param) }
      }
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

  registerLights(client){
      client.lights.getAll()
        .then(lights => {
            for (let light of lights) {
                let device = LightTranslator.hueLightToDevice(light,realm);
                this.home.addDevice(device.identity,device);
            }
        });
  }

  setSceneExample(param)
  {
    this.logger.info('In component service');
    this.logger.debug(param);
    this.logger.debug('With arrow function works!!!');
  }

}
export default Hue;

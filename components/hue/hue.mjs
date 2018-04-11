import huejay from 'huejay';
import BaseComponent from '../../system/baseComponent';
import  ComponentRegistry from '../../system/componentRegistry';
import Light from '../../devices/light';
import readline from 'readline';

const realm = 'hue';
const deviceType = 'shh1';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Hue extends BaseComponent {

  static get realm(){
    return realm;
  }

  constructor({messagebus,logger,componentRegistry,home,store}){
    super(messagebus,home,store);

    this.logger = new logger('Hue');
    this.bridge_ip = this.getStoreValue('hue_bridge_ip');
    this.hue_username = this.getStoreValue('hue_username');
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

  /* Moving to this best way!!
  exposedFunction(){
    let exposed =  new Map()
    exposed.set('set_scene','setSceneExample');
    return exposed;
  }*/


  pullData(){
    let device = new Light('light001',realm,'on',Object.entries({intencity: 40}),{macaddress:1});
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


  async install(){

    this.logger.debug('Install component...');

    let bridge_user = await this.getStoreValue('hue_username');
    let bridge_ip = await this.getStoreValue('hue_bridge_ip');

    if(null == bridge_ip || bridge_ip == undefined){
        let bridge = await this.discovery();
        this.logger.debug(`Found bridge ${bridge.ip}`);
        this.setStoreValue('hue_bridge_ip',bridge.ip);
        bridge_ip = bridge.ip;


    }
    let bridge_options ={};
    bridge_options.host = bridge_ip;

    if(bridge_user != undefined || bridge_user != null){
      bridge_options.username = bridge_user;
    }

    this.logger.debug(`using options ${JSON.stringify(bridge_options)}`);

    let client = new huejay.Client(bridge_options);

    if(bridge_user == undefined || bridge_user == null) {
      await this.waitUserConfirm();
      let user = await this.createUser(client);
      this.setStoreValue('hue_username','LK8Eq-ce7zIJdZpUOfQBcu5jSnJr7kfGUGTDnKKy');
    }

    let authenticatedUser = await this.getUser(client);

    this.logger.debug('Registring lights');
    this.registerLights(client);
  }


  registerLights(client){
      client.lights.getAll()
          .then(lights => {
              for (let light of lights) {
              let identity = realm + light.uniqueId;

              let extras = {
                manufacturer: light.manufacturer,
                modelId: light.modelId,
                model: light.model,
                software_version: light.softwareVersion
              }

              let attributes = {
                  id: light.id,
                  type: light.type,
                  name: light.name,
                  reachable: light.reachable,
                  brightness: light.brightness,
                  colorMode: light.colorMode,
                  hue: light.hue,
                  saturation: light.saturation,
                  colorTemp: light.colorTemp,
                  alert: light.alert,
                  effect: light.effect
              };

              let state = (light.on)  ? 'on' : 'off';
              let homelight = new Light(identity,realm,state,attributes,extras);
              this.home.addDevice(identity,homelight);
            }
          });
  }


  waitUserConfirm() {
    return new Promise((resolve) => {
      rl.question('Please press button on bridge ... ', (done) => { resolve(done) })
    });
  }


   discovery(){
    this.logger.debug('Starting brige installation...');
    return huejay.discover()
      .then(bridges => {
        console.log(bridges);
        for (let bridge of bridges) {
          return bridge;
        }
      })
      .catch(error => {
        this.logger.info(`An error occurred: ${error.message}`);
      });
  }


  getUser(client){
    return client.users.get()
      .then(user => {
        console.log('Username:', user.username);
        console.log('Device type:', user.deviceType);
        console.log('Create date:', user.created);
        console.log('Last use date:', user.lastUsed);
        return user;
      });
  }

  createUser(client){
    let user = new client.users.User;
    user.deviceType = deviceType;
    return client.users.create(user)
    .then(user => {
      console.log(`New user created - Username: ${user.username}`);
      return user;
    }).catch(error => {
      if (error instanceof huejay.Error && error.type === 101) {
        return console.log(`Link button not pressed. Try again...`);
    }});
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

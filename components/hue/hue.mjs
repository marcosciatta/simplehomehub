import huejay from 'huejay';
import BaseComponent from '../../system/baseComponent';
import  ComponentRegistry from '../../system/componentRegistry';
import Light from '../../devices/light';
import readline from 'readline'


const realm = 'hue';
const deviceType = 'shh';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})



class Hue extends BaseComponent {

  static get realm(){
    return realm;
  }

  constructor({messagebus,logger,componentRegistry,home}){
    super();
    this.messagebus = messagebus;
    this.home = home;
    this.logger = new logger('Hue');
    this.bridge = undefined;
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
    this.logger.debug('Start component');

    let bridge =await this.discovery();
    this.logger.debug(`Found bridge ${bridge.ip}`);

    this.bridge = bridge;

    let client = new huejay.Client({
      host:    bridge.ip,
      username: 'suhL9adfkVqJ4J6Al0tLxTcAPefnuq2aroUs2Lj2'
    });
    await this.waitUserConfirm();
    //let user = await this.createUser(client);
    //console.log(user);
    let authenticatedUser = await this.getUser(client);
    console.log(authenticatedUser);

    this.logger.debug('Registring lights');
    this.registerLights(client);
    /*this.logger.debug('Register listeners');
    this.registerListeners();

    this.logger.debug('Creating one light device on realm ['+ realm+']');
    let device = new Light('light001',realm,'off',Object.entries({intencity: 20}),{macaddress:123});
    this.home.addDevice('light001',device); */
  }


  registerLights(client){
    client.lights.getAll()
  .then(lights => {
    for (let light of lights) {
      console.log(`Light [${light.id}]: ${light.name}`);
      console.log(`  Type:             ${light.type}`);
      console.log(`  Unique ID:        ${light.uniqueId}`);
      console.log(`  Manufacturer:     ${light.manufacturer}`);
      console.log(`  Model Id:         ${light.modelId}`);
      console.log('  Model:');
      console.log(`    Id:             ${light.model.id}`);
      console.log(`    Manufacturer:   ${light.model.manufacturer}`);
      console.log(`    Name:           ${light.model.name}`);
      console.log(`    Type:           ${light.model.type}`);
      console.log(`    Color Gamut:    ${light.model.colorGamut}`);
      console.log(`    Friends of Hue: ${light.model.friendsOfHue}`);
      console.log(`  Software Version: ${light.softwareVersion}`);
      console.log('  State:');
      console.log(`    On:         ${light.on}`);
      console.log(`    Reachable:  ${light.reachable}`);
      console.log(`    Brightness: ${light.brightness}`);
      console.log(`    Color mode: ${light.colorMode}`);
      console.log(`    Hue:        ${light.hue}`);
      console.log(`    Saturation: ${light.saturation}`);
//      console.log(`    X/Y:        ${light.xy[0]}, ${light.xy[1]}`);
      console.log(`    Color Temp: ${light.colorTemp}`);
      console.log(`    Alert:      ${light.alert}`);
      console.log(`    Effect:     ${light.effect}`);
      console.log();
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

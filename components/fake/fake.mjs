import BaseComponent from '../../system/baseComponent';
import ComponentRegistry from '../../system/componentRegistry';
import Light from '../../devices/light.mjs';

const realm = 'fake';


export default class Fake extends BaseComponent {

    constructor({messagebus,logger,componentRegistry,home,store}){
        super(messagebus,home,store);

        this.logger = new logger('Fake');
        this.fake_ip = this.getStoreValue('fake_value');
    }

    static get realm(){
        return realm;
    }

    static registerInfo(){
        return {
            id: 'fake',
            type: ComponentRegistry.typeApplaiance,
            name: 'Fake Test Component',
            'icon': '/applaiances/fake.jpg',
            'short_name': 'Fake Component'
        };
    }

    async start(){
        this.registerListeners();
        this.registerDevice();
    }

    async install(){
        this.logger.debug('Start fake component...');
        this.setStoreValue('fake_value','hi');
        this.start();
    }

    registerServices(){
        return {
            say_hello: (param) => {this.sayHello(param) },
        }
    }

    sayHello(){
        console.log('Hello!');
    }

    registerDevice(client){
        let attributes = { hue:20};

        let devices = new Array();
        let device = new Light('FK:01','Fake light 01','fake','off',attributes,{platform: 'fake'});
        this.home.addDevice(device.identity,device);
    }


    registerListeners()
    {
        this.messagebus.subscribe({
            channel: 'home',
            topic: 'fake.changed.state',
            callback: (data, envelope) => {
                this.logger.debug('Recived message');
                let device = this.home.getDevice(data.identity);
                this.logger.info('Change state to device ' + device.identity  + ' to ' + data.to);
            }
        });
    }
}

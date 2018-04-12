import {TimeEvent} from './events';
import Container from './dicontainer.mjs';
import { Logger } from './logger.mjs';

export default class Time {
    constructor(seconds = 1){
        this.logger = new Logger('timer');
        this.messagebus = Container.resolve('messagebus');
        this.timer = setInterval(() => {
            this.launchTimeEvent();
        },seconds * 1000);
    }

    launchTimeEvent(){
        this.logger.debug('time event launched');
        let evt = new TimeEvent();
        this.messagebus.publish(evt);
    }
}
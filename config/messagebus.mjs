import _ from 'lodash';
import container from '../config/dicontainer';


class MessageBus {
  constructor(){
      this.container = container;
      this.postal = this.container.resolve('postal');
  }

  publish(eventObject){
    this.postal.publish({channel:eventObject.channel,topic: eventObject.topic, data: eventObject.data});
  }

  subscribe(channel,topic,callback){
    this.postal.subscribe(channel,topic,callback);
  }
}

export default MessageBus;

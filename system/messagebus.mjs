import _ from 'lodash';

class MessageBus {
  constructor({postal,logger}){
      this.postal = postal;
      this.logger = new logger('messagebus');
  }

  publish(eventObject){
    this.logger.debug('Publish message');
    this.logger.debug({channel:eventObject.channel,topic: eventObject.topic, data: JSON.stringify(eventObject.data)});
    this.postal.publish({channel:eventObject.channel,topic: eventObject.topic, data: eventObject.data});
  }

  subscribe(channel,topic,callback){
    this.postal.subscribe(channel,topic,callback);
  }
}

export default MessageBus;

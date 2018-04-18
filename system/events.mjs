import _ from 'lodash';

class GenericEvent{
  constructor(channel,topic,data ={}){
    this.channel = channel;
    this.topic = topic;
    this.data = data;
  }
}

class DeviceGenericEvent{
  constructor(identity,topic,realm,data ={}){
    this.channel = 'home';
    this.topic = realm+'.'+topic;
    this.data = data;
    this.data.identity = identity;
  }
}

class DeviceAddedEvent extends DeviceGenericEvent {
    constructor(identity,realm, data){
        let topic = 'device.added';
        super(identity,topic,realm,data);
    }
}

class DeviceUpdatedEvent extends DeviceGenericEvent {
    constructor(identity,realm, data){
        let topic = 'device.updated';
        super(identity,topic,realm,data);
    }
}

class DeviceChangedStateEvent{

  constructor(identity,realm,from,to,data = {}){
    this.channel = 'home';
    this.topic = realm+'.device.changed.state';
    this.data = _.assign(data,{from: from, to: to});
    this.data.identity = identity;
    this.data = data;
  }
}

class DeviceStateChangeEvent{
  constructor(identity,realm,operation,data={}){
    this.channel = 'home';
    this.topic = realm+'.change.state';
    this.data = _.assign({operation:operation},data);
    this.data.identity = identity;
  }
}

class DeviceChangedAttributesEvent
{
    constructor(identity,realm,operations,data={}){
        this.channel = 'home';
        this.topic = realm+'.device.changed.attributes';
        this.data = _.assign({operations:operations},data);
        this.data.identity = identity;
    }
}

class SystemEvent{
  constructor(topic,data ={}){
    this.channel = 'system';
    this.topic = topic;
    this.data = data;
  }
}

class TimeEvent {
  constructor()
  {
    this.channel = 'time';
    this.topic = 'time.changed';
    this.data = {time: Date.now()}
  }
};


export {
    GenericEvent,
    DeviceGenericEvent,
    DeviceAddedEvent,
    DeviceUpdatedEvent,
    DeviceChangedStateEvent,
    DeviceStateChangeEvent,
    DeviceChangedAttributesEvent,
    SystemEvent,
    TimeEvent,
}

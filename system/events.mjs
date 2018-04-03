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

class DeviceStateChangedEvent{

  constructor(identity,realm,from,to,data = {}){
    this.channel = 'home';
    this.topic = realm+'.changed.state';
    this.data = {};
    this.data.identity = identity;
    this.data = _.assign(data,{from: from, to: to});
    this.data = data;
  }
}

class DeviceStateChangeEvent{
  constructor(identity,realm,operation,data={}){
    this.channel = 'home';
    this.topic = realm+'.change.state';
    this.data = _.assing({operation:operation},data);
    this.data.identity = identity;
  }
}

class SystemEvent{
  constructor(identity,topic,data ={}){
    this.channel = 'system';
    this.topic = topic;
    this.data = data;
  }
}

class TimeEvent {
  constructor(identity,topic, data = {})
  {
    this.channel = 'time';
    this.topic =topic;
    tis.data = data;
  }
};

export {
    GenericEvent,
    DeviceGenericEvent,
    DeviceStateChangedEvent,
    DeviceStateChangeEvent,
    SystemEvent,
    TimeEvent,
}

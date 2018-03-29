import _ from 'lodash';

class Rule {

  constructor(name, options){
    this.name = name;
    this.trigger = options.trigger;
    this.result = options.result;
  }

  addTriggerEvent(type, channel, data){
    this.trigger.type = 'event';
    this.trigger.topic = 'device';
    this.trigger.channel = channel;
    this.trigger.data = data;
  }

  addResulEvent(type, channel ,data){
    this.result.type = 'event';
    this.result.channel  = channel;
    this.result.data = data;
  }

  getTriggerType(){
    return this.trigger.type;
  }

  getTrigger()
  {
    return this.trigger;
  }

  process(container, data){
    if(!_.matches(this.trigger.with)( data )){
      return false;
    }
    this.doResult(container);
  }


  doResult(container){
    let result = this.result;
    if(!_.isArray(this.result)) result =  [result];
    _.forEach(result, function(res){
      if(res.type == 'event'){
        let postal = container.resolve('postal');
        postal.publish({channel: 'device', topic: res.name, data: res.with});
      }
    })

  }
};

export default Rule;

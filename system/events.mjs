class deviceChangedStateEvt(identity, from_state, to_state){
  this.channel = 'device';
  this.topic = 'change-state-event';
  this.data = {};
  this.data.identity = identity;
  this.data.from_state = from_state;
  this.data.to_state = to_state;
}

class doOperationOnDevice(identity,operation,data){
  this.channel = 'device';
  this.identity = identity;
  this.operation = operation;
  this.data = data;
}

export deviceChangedState;
export doOperationOnDevice;

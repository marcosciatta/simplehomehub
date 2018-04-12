const SYNC_TIME = 'sync_time';
const SYNC_NONE = 'sync_none';

class BaseComponent{

  constructor(messagebus,home,store){
      this.messagebus = messagebus;
      this.home = home;
      this.store = store;
      this.sync = {type: BaseComponent.syncNone, every: 0};
      this.sync_timer = 0;
      this.subscribeTimeChangeEvent();
  }

  static get syncTime(){
      return SYNC_TIME;
  }

  static get syncNone(){
        return SYNC_NONE;
  }


  static registerInfo(){
    return false;
  }

  install(){
    console.log('Install plugin!!!');
  }

  registerServices(){
    return {};
  }

  getStoreValue(key){
      return new Promise((resolve,reject) => {
          this.store.get(key,(reject,response) => {
              resolve(response);
          });
      });
  }

  setStoreValue(key,value){
      return new Promise((resolve,reject) => {
          this.store.set(key,value);
          resolve();
      });
  }

  subscribeTimeChangeEvent()
  {
      this.messagebus.subscribe({
          channel: 'time',
          topic: 'time.changed',
          callback: (data) => { this.resyncOnTime(data); }
      });
  }

  resyncOnTime(){
     if(this.sync.type == BaseComponent.syncTime){
         if(this.sync_timer <= this.sync.every){
             this.sync_timer++;
         } else {
             this.sync_timer = 0;
             this.logger.debug('Resync component');
             this.resync();
         }

     }
  }

  resync(){

  }

}

export default BaseComponent;

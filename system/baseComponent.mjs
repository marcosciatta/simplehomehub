class BaseComponent{

  constructor({messagebus,home,store}){
      this.messagebus = messagebus;
      this.home = home;
      this.store = store;
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

}

export default BaseComponent;

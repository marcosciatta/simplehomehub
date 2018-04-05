class BaseComponent{
  static registerInfo(){
    return false;
  }

  install(){
    console.log('Install plugin!!!');
  }

  registerServices(){
    return {};
  }
}

export default BaseComponent;

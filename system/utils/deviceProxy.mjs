import _ from 'lodash';

function deviceStateTraker(obj, onChange) {
    const handler = {
        set (obj, prop, value) {

            
            let changes = new Array();
            var oldVal = obj[prop];
            Reflect.set(obj, prop, value);

            if(_.isMap(oldVal)){
              for(let [k,v] of oldVal){
                if(value.has(k) && value.get(k) != v){
                    changes.push([`${prop}.${k}`,v,value.get(k)]);
                    //console.log(`Property ${prop}.${k} changed from ${v} to ${value.get(k)}`);
                }
              }
            } else  {
              changes.push([prop,oldVal,v]);
            }

            onChange(obj, prop, oldVal, value,changes);
            return true;
        }
    };
    return new Proxy(obj, handler);
}

function SafeObjectProxyProperty(obj){
  return new Proxy(obj, {
  get: function(target, name){
    return hasKey(target, name) ?
      (isObject(target[name]) ? SafeObjectProxyProperty(target[name]) : target[name]) : Undefined;
  }
});
}

export { deviceStateTraker, SafeObjectProxyProperty };

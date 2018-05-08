export default class Comm
{
    /** Lights comm funcs */
    static changeLightState(client, lightId,data){
        return client.lights.getById(lightId).then((light) => {
            light.on = (data.to == 'on');
            return client.lights.save(light);
        })
    }

    static changeLightAttribute(client, lightId,data){
        return client.lights.getById(lightId).then((light) => {
            for(let key of Object.keys(data.operations)) {
                Comm.handleAttributeChange(key, data.operations[key],light);
            }
            return client.lights.save(light);
        });
    }

    /** Groups comm funcs */
    static changeGroupState(client, groupId,data){
        return client.groups.getById(groupId).then((group) => {
            console.log('FOUND GROUP !!!');
            group.on = (data.to == 'on');
            return client.groups.save(group);
        })
    }

    static changeGroupAttribute(client, groupId,data){
        return client.groups.getById(groupId).then((group) => {
            for(let key of Object.keys(data.operations)) {
                Comm.handleAttributeChange(key, data.operations[key],group);
            }
            return client.groups.save(group);
        });
    }

    /** UTILS **/
    static handleAttributeChange(attribute,value, obj){
        if(attribute == 'color'){
            let [r,g,b] = _.split(value,',');
            let [x,y] = rgb_to_cie(parseInt(r),parseInt(g),parseInt(b));
            let xy = new Array();
            xy.push(parseFloat(x));
            xy.push(parseFloat(y));
            obj['xy'] = xy;

        } else {
            obj[attribute] = value;
        }
    }
}
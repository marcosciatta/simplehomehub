import componentModel from '../models/components';

export default class ComponentController {

    async getAllComponents(filters){
        let components = await componentModel.find(filters);
        return components;
    }

    async getComponentDetail(id){
        let component = await componentModel.findOne({id:id});
        return component;
    }
}
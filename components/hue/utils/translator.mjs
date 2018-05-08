import RgbLight from '../../../devices/rgblight.mjs';
import DimmableLight from '../../../devices/dimmablelight.mjs';
import LightGroup from '../../../devices/lightGroup.mjs';
import IdentityProvider from '../../../system/utils/identityProvider';

import { cie_to_rgb } from './rgbcie.mjs';

class LightTranslator {

    static hueLightToDevice(light,realm) {

        let name = light.name;
        let identity = IdentityProvider.provideIdentity('hue',light.uniqueId);


        if(light.type.toLowerCase() == 'extended color light')
            return this.rgbLight(identity,name,light,realm);

        if(light.type.toLowerCase() == 'dimmable light'){
            return this.dimmableLight(identity,name,light,realm);
        }
    }

    static hueGroupToDevice(group,realm){
        let identity = '';

        if(group.modelId !== undefined)
            identity = IdentityProvider.provideIdentity('hue',group.uniqueId);
        else
            identity = IdentityProvider.provideIdentity('hue',group.id + '_'+group.type);
        let name = group.name;

        let color_state = {
            brightness: group.brightness,
            colorMode: group.colorMode,
            hue: group.hue,
            saturation: group.saturation,
            colorTemp: group.colorTemp,
            xy: group.xy
        };

        let data = {
            modelId: group.modelId,
            uniqueId: group.uniqueId,
            color_state: color_state,
            type: group.type,
            anyOn: group.anyOn,
            allOn: group.allOn,
            model: group.model
        };

        let attributes = {
            id: group.id,
            lightIds: group.lightIds,
            class: group.class,
            name: group.name,
            brightness: group.brightness,
            transitionTime: group.transitionTime,
            alert: group.alert,
            effect: group.effect,
            scene: group.scene
        };
        if(color_state.xy != undefined){
            attributes.color = cie_to_rgb(color_state.xy[0],color_state.xy[1],group.brightness);
        }

        let state = (group.on)  ? 'on' : 'off';
        let device =  new LightGroup(identity,name,realm,state,attributes,data);
        device.setComTypeAsync();
        return device;

    }

    static rgbLight(identity,name,light,realm){
        console.log(light);
        let color_state = {
            brightness: light.brightness,
            colorMode: light.colorMode,
            hue: light.hue,
            saturation: light.saturation,
            colorTemp: light.colorTemp,
            colorRgb: light.rgb,
            xy: light.xy,
        };

        let data = {
            manufacturer: light.manufacturer,
            modelId: light.modelId,
            model: light.model,
            software_version: light.softwareVersion,
            color_state: color_state,
            type: light.type,
            uniqueId: light.uniqueId
    };

        let attributes = {
            id: light.id,
            name: light.name,
            reachable: light.reachable,
            brightness: light.brightness,
            alert: light.alert,
            effect: light.effect,
            transitionTime: light.transitionTime
        };
        if(color_state.xy != undefined){
            attributes.color = cie_to_rgb(color_state.xy[0],color_state.xy[1],light.brightness);
        }


        let state = (light.on)  ? 'on' : 'off';
        let device =  new RgbLight(identity,name,realm,state,attributes,data);
        device.setComTypeAsync();
        return device;
    }

    static dimmableLight(identity,name,light,realm){

        let data = {
            manufacturer: light.manufacturer,
            modelId: light.modelId,
            model: light.model,
            software_version: light.softwareVersion,
            type: light.type,
            uniqueId: light.uniqueId
        };

        let attributes = {
            id: light.id,
            name: light.name,
            reachable: light.reachable,
            brightness: light.brightness,
            alert: light.alert
        };


        let state = (light.on)  ? 'on' : 'off';
        let device =  new DimmableLight(identity,name,realm,state,attributes,data);
        device.setComTypeAsync();
        return device;

    }
}

export { LightTranslator as default }
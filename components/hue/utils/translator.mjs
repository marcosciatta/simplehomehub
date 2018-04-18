import RgbLight from '../../../devices/rgblight.mjs';
import DimmableLight from '../../../devices/dimmablelight.mjs';

import { cie_to_rgb } from './rgbcie.mjs';

class LightTranslator {

    static hueLightToDevice(light,realm) {

        let identity = light.uniqueId;
        let name = light.name;

        console.log(light);
        if(light.type.toLowerCase() == 'extended color light')
            return this.rgbLight(identity,name,light,realm);

        if(light.type.toLowerCase() == 'dimmable light'){
            return this.dimmableLight(identity,name,light,realm);
        }

    }

    static rgbLight(identity,name,light,realm){
        let color_state = {
            brightness: light.brightness,
            colorMode: light.colorMode,
            hue: light.hue,
            saturation: light.saturation,
            colorTemp: light.colorTemp,
            colorRgb: light.rgb,
            xy: light.xy
        };

        let data = {
            manufacturer: light.manufacturer,
            modelId: light.modelId,
            model: light.model,
            software_version: light.softwareVersion,
            color_state: color_state,
            type: light.type
        };

        let attributes = {
            id: light.id,
            name: light.name,
            reachable: light.reachable,
            brightness: light.brightness,
            alert: light.alert,
            effect: light.effect
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
            type: light.type
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
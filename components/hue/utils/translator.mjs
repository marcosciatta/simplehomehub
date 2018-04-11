import RgbLight from '../../../devices/rgblight.mjs';

class LightTranslator {

    static hueLightToDevice(light,realm) {

        let identity = light.uniqueId;
        let name = light.name;

        let data = {
            manufacturer: light.manufacturer,
            modelId: light.modelId,
            model: light.model,
            software_version: light.softwareVersion
        }

        let attributes = {
            id: light.id,
            type: light.type,
            name: light.name,
            reachable: light.reachable,
            brightness: light.brightness,
            colorMode: light.colorMode,
            hue: light.hue,
            saturation: light.saturation,
            colorTemp: light.colorTemp,
            alert: light.alert,
            effect: light.effect
        };

        let color_state = {
            brightness: light.brightness,
            colorMode: light.colorMode,
            hue: light.hue,
            saturation: light.saturation,
            colorTemp: light.colorTemp,
        };

        let state = (light.on)  ? 'on' : 'off';
        return new RgbLight(identity,name,realm,state,attributes,color_state,data);
    }
}

export { LightTranslator as default }
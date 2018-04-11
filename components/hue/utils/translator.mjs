import Light from '../../../devices/light';

class LightTranslator {

    static hueLightToDevice(light,realm) {
        let identity = realm + light.uniqueId;

        let extras = {
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

        let state = (light.on)  ? 'on' : 'off';
       return new Light(identity,realm,state,attributes,extras);
    }
}

export { LightTranslator as default }
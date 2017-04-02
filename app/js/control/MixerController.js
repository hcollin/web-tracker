
import {model} from 'js/model/Model.js';

export default class MixerController {

    constructor() {

    }

    initialize() {
        if(!model.hasKey("channels")) {
            model.set("channels", {});
        }
    }

    getChannels(asKeyList=true) {
        const channels = model.get("channels");

        if(asKeyList) {
            const vals = Object.keys(channels);
            return vals;
        }

        return channels;
    }

    
    
}
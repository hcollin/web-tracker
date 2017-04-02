
import {model} from 'js/model/Model.js';

export default class MixerController {

    constructor() {

    }

    initialize() {
        if(!model.hasKey("channels")) {
            model.set("channels", {});
        }
    }

    getChannels(asKeyList=false) {
        const channels = model.get("channels");

        if(asKeyList) {
            const vals = Object.keys(channels);
            return vals;
        }

        return channels;
    }

    getChannelsAsList() {
        const channels = model.get("channels");

        let list = [];
        Object.keys(channels).forEach(id => {
            list.push(channels[id]);
        });
        
        return list;
    }

    
    
}
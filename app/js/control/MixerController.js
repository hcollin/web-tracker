
import {model} from 'js/model/Model.js';

import AudioChannelController from 'js/control/AudioChannelController.js';

export default class MixerController {

    constructor() {

    }

    initialize() {
        if(!model.hasKey("channels")) {
            model.set("channels", {});
        }
    }

    createChannel(type="AUDIO") {
        switch(type) {
            case "SYNTH":
                break;
            case "INPUT":
                break;
            case "AUDIO":
            default:
                let acc = new AudioChannelController();
                acc.create();
                break;
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
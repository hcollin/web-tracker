
import {model} from 'js/model/Model.js';

export class ChannelControl {

    constructor() {

    }

    create() {
        const channelId = "channel" + model.next("channel.counter");
        const channelData = {
            id: channelId,
            name: "Audio Channel",
            type: "AUDIO"
        }
        model.gset(["channels", channelId], channelData);
    }

    get(id=false) {
        if(!id) {
            return model.get("channels");
        }

        return model.gget(["channels", id]);
    }

    delete(id) {
        model.gdel(["channels", id]);
    }

}
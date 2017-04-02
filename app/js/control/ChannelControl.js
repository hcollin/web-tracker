
import {model} from 'js/model/Model.js';

export class ChannelControl {

    constructor(id=false) {
        this.id = id;
        this.data = {};
    }

    static create() {
        const channelId = "channel" + model.next("channel.counter");
        const channelData = {
            id: channelId,
            name: "Audio Channel",
            type: "AUDIO",
            volume: 80,
            pan: 0
        };
        model.gset(["channels", channelId], channelData);
    }

    get(id=false) {
        
        if(this.id && !id) {
            this.data = model.gget(["channels", this.id]);
            return this.data;
        }

        if(id) {
            this.data = model.gget(["channels", id]);
            return this.data;
        }
         
        return model.get("channels");   
    }

    update(values) {
        model.gset(["channels", this.id], values);
    }

    set(key, value) {
        this.get();
        this.data[key] = value;
        this.update(this.data);
    }

    delete(id=false) {
        if(!id && this.id !== false)
            id = this.id;
        model.gdel(["channels", id]);
        this.data = false;
    }

    typeSoundFile() {

    }

    typeSynth() {

    }

}
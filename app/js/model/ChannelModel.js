
import {model} from 'js/model/Model.js';

export default class ChannelModel {
    
    constructor(id=false) {
        this.id = id;
        this.name = "Channel";
        this.type = "AUDIO";
        this.volume = 80;
        this.pan = 0;
        this.mute = false;
    }

    create() {
        this.id = "channel-" + model.next("channel.counter");
        this.name = this.id;
        this.type = "AUDIO";
        this.volume = 80;
        this.pan = 0;
        this.mute = false;
        return this;
    }

    load(id=false) {
         if(!id) {
            if(this.id) {
                id = this.id;
            } else {
                console.error("Cannot load a channel when no id has been provided!", this);
                return false;
            }
        }
        const data = model.gget(["channels", id]);

        if(data == undefined) {
            return false;
        }
        this.name = data.name;
        this.id = data.id;
        this.type = data.type;
        this.volume = data.volume;
        this.pan = data.pan;
        this.mute = data.mute;
    }

    save() {
         if(!this.id) {
            console.error("Cannot save channel model if it does not have an id.", this);
            return false;
        }
        return model.gset(["channels", this.id], this.asData());
    }

    remove() {
        if(!this.id) {
            console.error("Cannot remove a channel from model if it does not have an id.", this);
            return false;
        }
        return model.gdel(["channels", this.id]);
    }

    exists() {
        return model.ghas(["channels", this.id]);
    }

    asData() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            volume: this.volume,
            pan: this.volume,
            mute: this.mute
        };
    }

}
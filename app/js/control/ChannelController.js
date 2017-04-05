
import {model} from 'js/model/Model.js';
import ChannelModel from 'js/model/ChannelModel.js';

import { player } from 'js/control/Player.js';

export default class ChannelController {

    constructor(id=false) {

        if(id) {
            this.channel = new ChannelModel(id);
        }
        
    }

    initialize() {

    }

    create(type="AUDIO") {
        this.channel = new ChannelModel();
        this.channel = this.channel.create();
        this.channel.type = type;
        this.channel.save();
    }

    get(id=false) {
        if(id) {
            this.channel = new ChannelModel(id);
        }
        this.channel.load();
        return this.channel;
    }

    set(key, value) {
        this.channel[key] = value;
    }

    toggleMute(toValue=null) {
        if(toValue!=null) {
            this.set("mute", toValue);
            this.update();
            player.updateSound(this.channel.id);
            return this;
        }
        this.set("mute", !this.channel.mute);
        this.update();
        player.updateSound(this.channel.id);
        return this;
    }

    toggleEffect(type) {
        if(this.channel.effects[type] == undefined) {
            this.channel.effects[type] = false;
        }
        this.channel.effects[type] = !this.channel.effects[type];
        this.update();
    }

    effectOn(type) {
        if(this.channel.effects[type] == undefined) {
            this.channel.effects[type] = false;
            return false;
            // this.update();
        }
        return this.channel.effects[type]
    }

    update() {
        this.channel.save();
    }

    remove() {
        this.channel.remove();
    }
}
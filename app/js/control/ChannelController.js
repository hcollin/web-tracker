
import {model} from 'js/model/Model.js';
import ChannelModel from 'js/model/ChannelModel.js';

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

    update() {
        this.channel.save();
    }

    remove() {
        this.channel.remove();
    }
}
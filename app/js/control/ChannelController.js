
import {model} from 'js/model/Model.js';
import ChannelModel from 'js/model/ChannelModel.js';

export default class ChannelController {

    constructor(id=false) {

        if(id) {
            this.channel = new ChannelModel(id);
        }
        
    }

    initialize() {
        if(!model.hasKey("channels")) {
            model.set("channels", {});
        }
    }

    create() {
        this.channel = new ChannelModel();
        this.channel = this.channel.create();
        this.channel.save();
    }

    get(id=false) {
        if(id) {
            this.channel = new ChannelModel(id);
            this.channel.load();
        }
        
        return this.channel;
    }

    set(key, value) {
        this.channel[key] = value;
    }

    update() {
        this.channel.save();
    }
}
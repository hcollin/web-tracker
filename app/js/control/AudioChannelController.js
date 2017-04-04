
import {model} from 'js/model/Model.js';
import ChannelModel from 'js/model/ChannelModel.js';
import ChannelController from 'js/control/ChannelController.js';

export default class AudioChannelController extends ChannelController {

    constructor(id=false) {
        super(id);
    }

    create() {
        super.create("AUDIO");
    }

    getDataId() {
        console.log("AudioChannelController", this);
        return this.channel.id + ".audio.file.content";
    }

}
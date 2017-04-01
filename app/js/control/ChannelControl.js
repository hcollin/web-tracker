

export class ChannelControl {

    constructor() {

    }


    create() {
        const channelData = {
            id: model.next("channel.counter"),
            name: "Audio Channel",
            type: "AUDIO"
        }
        model.push("channels", channelData);
    }
}
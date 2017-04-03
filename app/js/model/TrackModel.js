import {model} from 'js/model/Model.js';

export default class TrackModel {

    constructor(id=false) {
        this.id = id;
        this.notes = [];
        this.pattern = false;
        this.channelId = false;
        this.beats = 8;

    }

    create(beats=8) {
        const trackId = "track-" + model.next("track.counter");
        this.id = trackId;
        this.beats = beats;
        const aNotes = Array(this.beats).fill({});
        aNotes.forEach((item, idx) => {
            // const note = {note: false, octave: false, volume: 100, start: false, stop: false, index: idx};
            const note = {};
            aNotes[idx] = note;
        });
        this.notes = aNotes;
        this.channelId = false;
    }

    load(id=false) {
        if(!id) {
            if(this.id) {
                id = this.id;
            } else {
                console.error("Cannot load the track when no id has been provided!", this);
                return false;
            }
        }
        const data = model.gget(["tracks", id]);
        
        if(data == undefined) {
            return false;
        }
        this.id = data.id;
        this.notes = data.notes;
        this.pattern = data.pattern;
        this.channelId = data.channelId;
        this.beats = data.beats;
    }

    save() {
        if(!this.id) {
            console.error("Cannot save the track model if it does not have an id.", this);
            return false;
        }
        return model.gset(["tracks", this.id], this.asData());
    }

    remove() {
        if(!this.id) {
            console.error("Cannot remove the track from model if it does not have an id.", this);
            return false;
        }
        return model.gdel(["tracks", this.id]);
    }

    exists() {
        return model.ghas(["tracks", this.id]);
    }

    asData() {
        return {
            id: this.id,
            pattern: this.pattern,
            channelId: this.channelId,
            beats: this.beats,
            notes: this.notes
        };
    }

}

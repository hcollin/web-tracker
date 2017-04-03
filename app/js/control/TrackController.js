
import { model } from 'js/model/Model.js';

import TrackModel from 'js/model/TrackModel.js';

export default class TrackController {

    constructor(id=false) {

        this.id = id;
        this.track = new TrackModel(this.id);
        
    }

    initialize() {
        if(!model.hasKey("tracks")) {
            model.set("tracks", {});
        }
    }

    create(args={}) {
        const opts = Object.assign({channelId: false, beats: 8, patternId: false}, args);
        this.track = new TrackModel();
        this.track.create();
        this.track = Object.assign(this.track, opts);
        this.resizeNotes(); // This also saves automatically
    }

    get(id=false) {
        if(!id) {
            id = this.id;

        }
        this.track.load(id);
        return this.track;
    }

    set(key, value) {
        this.track[key] = value;
    }

    
    update() {
        this.track.save();
    }

    remove() {
        this.track.remove();
    }

    reset(values) {
        this.set("notes", values.notes);
        this.set("channelId", values.channelId);
        this.set("patternId", values.patternId);
        this.set("beats", values.beats);
        this.resizeNotes();
        this.update();
    }


    setNote(index, note) {
        this.track.notes[index] = note;
    }

    getNote(index) {
        return this.track.notes[index];
    }

    resizeNotes(beats=false) {
        if(!beats) {
            beats = this.track.beats;
        }

        if(beats < 1 || beats > 64) {
            console.warn("Beat value for track must be between 1 and 64 : ", beats);
            return;
        }

        
        
        const currentNotesLen = this.track.notes.length;
        
        if(beats > currentNotesLen) {
            const newNotes = Array(beats - currentNotesLen).fill({});    
            aNotes.forEach((item, idx) => {
                const note = {};
                aNotes[idx] = note;
            });
            this.track.notes = this.track.notes.concat(aNotes);
            
            
        } 

        if(beats < currentNotesLen) {
            this.track.notes = this.track.notes.slice(0, beats-1);
        }

        this.update();
    }

}
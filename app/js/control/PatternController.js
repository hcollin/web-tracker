
import {model} from 'js/model/Model.js';

import PatternModel from 'js/model/PatternModel.js';


export default class PatternController {
    
    constructor(id=false) {
        this.pattern = false;
        
        if(id) {
            this.pattern = new PatternModel(id);
            this.pattern.load();
        }
        
    }

    initialize() {
        // Create model if it does not exist yet
        if(!model.hasKey("patterns")) {
            model.set("patterns", {});
            this.create();
        }
    }

    create() {
        
        this.pattern = new PatternModel();
        this.pattern.craete();
        this.createNewNoteTrack();
        this.pattern.save();
        return this.pattern;
    }

    get(id=false) {
        if(id) {
            this.pattern = new PatternModel(id);
            this.pattern.load();
        }
        return {
            id: this.pattern.id,
            name: this.pattern.name,
            tracks: this.pattern.tracks,
            beats: this.pattern.beats
        };
    }

    set(key, value) {
        this.pattern[key] = value;
    }

    update() {
        this.pattern.save();
    }

    exists(id=false) {
        if(!id) {
            return this.pattern.exists();
        }
        let pat = new PatternModel();
        pat.id = id;
        return pat.exists();
    }

    remove() {
        this.pattern.remove();
    }

    getAll(asList=false) {
        const pats =  model.get("patterns");
        if(asList) {
            const vals = Object.values(pats);
            console.log("Patterns as list", vals);
            return vals;
        } 
        return pats;
    }

    createNewNoteTrack() {
        const aNotes = Array(this.pattern.beats).fill({});
        aNotes.forEach((item, idx) => {
            const note = {note: false, octave: false, volume: 100, start: false, stop: false, index: idx};
            aNotes[idx] = note;
        });

        this.pattern.tracks.push({
            notes: aNotes,
            channelId: false,
            pattern: this.pattern.id
        });
        this.pattern.save();
    }

    updateNoteTrack(index, values) {
        this.pattern.tracks[index] = values;
        this.pattern.save();
    }

    removeNoteTrack(index) {
        console.log("remove track", index, this.pattern.tracks[index]);
        this.pattern.tracks.splice(index, 1);
        console.log("after remove", index, this.pattern.tracks[index]);
        this.pattern.save();

    }

    getAllKeys() {
        const pats = model.get("patterns");
        return Object.keys(pats);
    }




}
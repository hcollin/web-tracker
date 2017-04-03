
import {model} from 'js/model/Model.js';

import PatternModel from 'js/model/PatternModel.js';
import TrackController from 'js/control/TrackController.js';

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
        this.pattern.save();
        this.addNewTrack();
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
            return vals;
        } 
        return pats;
    }

    addNewTrack() {
        let tc = new TrackController();
        tc.create({patternId: this.pattern.id, beats: this.pattern.beats});
        const newTrack = tc.get();
        this.pattern.tracks.push(newTrack.id);
        this.update();
    }

    removeTrack(id) {
        
        const newTracks = this.pattern.tracks.filter((item) => {
            return item.id != id;
        });
        this.pattern.tracks = newTracks;
        this.update();
    }

    updateTrack(track) {
        let tc = new TrackController(track.id);
        tc.reset(track);
    }

    getAllKeys() {
        const pats = model.get("patterns");
        return Object.keys(pats);
    }

    debug() {
        console.log(this.pattern);
    }




}
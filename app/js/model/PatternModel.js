
import {model} from 'js/model/Model.js';

export default class PatternModel {

    constructor(id=false) {
        this.name = "";
        this.id = id;
        this.tracks = [];
        this.beats = 8;
    }

    /**
     * This method creates an empty pattern model with new id.
     */
    craete() {
        this.id = "pattern-" + model.next("pattern.counter");
        this.name = this.id;
        this.beats = 8;
        this.tracks = [];
    }

    load(id=false) {
        if(!id) {
            if(this.id) {
                id = this.id;
            } else {
                console.error("Cannot load a pattern when no id has been provided!", this);
                return false;
            }
        }
        const data = model.gget(["patterns", id]);
        
        if(data == undefined) {
            return false;
        }
        this.name = data.name;
        this.id = data.id;
        this.tracks = data.tracks;
        this.beats = data.beats;
    }

    save() {
        if(!this.id) {
            console.error("Cannot save pattern model if it does not have an id.", this);
            return false;
        }
        return model.gset(["patterns", this.id], this.asData());
    }

    remove() {
        if(!this.id) {
            console.error("Cannot remove a pattern from model if it does not have an id.", this);
            return false;
        }
        return model.gdel(["patterns", this.id]);
    }

    exists() {
        return model.ghas(["patterns", this.id]);
    }

    asData() {
        return {
            id: this.id,
            name: this.name,
            tracks: this.tracks,
            beats: this.beats
        };
    }
}
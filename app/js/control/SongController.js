
import {model} from 'js/model/Model.js';

import SongModel from 'js/model/SongModel.js';


export default class SongController {

    constructor() {
        this.song = new SongModel();
        if(this.song.exists()) {
            this.song.load();
        }
        
    }

    initialize() {
        // Create model if it does not exist yet
        if(!this.song.exists()) {
            this.create();
        }
    }

    create() {
        this.song = new SongModel();
        this.song.create();
        this.song.save();
    }

    get() {
        this.song.load();
        return this.song;
    }

    set(key, value) {
        this.song[key] = value;
    }

    update() {
        this.song.save();
    }

    addPattern(pattern, index=false) {
        const songPattern = {
            id: "song-pattern-"+model.next("song.pattern.counter"),
            patternId: pattern
        };
        this.song.patterns.push(songPattern);
        this.update();
    }

    changePattern(pattern, index) {
        this.song.patterns[index] = pattern;
        this.update();
    }

    removePattern(index) {
        this.song.patterns.splice(index, 1);
        this.update();
    }

    patternUp(index) {
        if(index > 0) {
            const from = this.song.patterns[index];
            const to = this.song.patterns[index-1];
            this.song.patterns[index] = to;
            this.song.patterns[index -1] = from;
            this.update();
        }
    }

    patternDown(index) {
        if(index < this.song.patterns.length - 1) {
            const from = this.song.patterns[index];
            const to = this.song.patterns[index + 1];
            this.song.patterns[index] = to;
            this.song.patterns[index +1 ] = from;
            this.update();
        }
    }

    openFromFile(filename) {     
        this.song["saveFileName"] = fileName;
    }

    saveToFile() {

    }

}
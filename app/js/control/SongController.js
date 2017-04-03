
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
        this.song.patterns.push(pattern);
        this.update();
    }

    removePattern(index) {
        this.song.patterns.splice(index, 1);
        this.update();
    }

    openFromFile(filename) {
        
        this.song["saveFileName"] = fileName;
    }

    saveToFile() {

    }

}
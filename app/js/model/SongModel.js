
import {model} from 'js/model/Model.js';

export default class SongModel {

    constructor(id=false) {
        this.id = id;
        this.name = "";
        this.patterns = [];
        this.artist = "Unknown artist";
        this.filename = "";
        this.bpm = 120;
    }

    /**
     * This method creates an empty pattern model with new id.
     */
    create() {
        this.id = "song-" + model.next("song.counter");
        this.name = this.id;
        this.patterns = [];
        this.artist = "Unknown artist";
        this.filename = "";
        this.bpm = 120;
    }

    load() {     
        this.name = model.get("song.name");
        this.id = model.get("song.id");
        this.patterns = model.get("song.patterns");
        this.artist = model.get("song.artist");
        this.filename = model.get("song.filename");
        this.bpm = model.get("song.bpm");
    }

    save() {
        model.setMap({
            "song.name": this.name,
            "song.id": this.id,
            "song.artist": this.artist,
            "song.patterns": this.patterns,
            "song.filename": this.filename,
            "song.bpm": this.bpm
        });
    }

    remove() {
        this.create();
        this.save();
    }

    exists() {
        return model.hasKey("song.name");
    }

    asData() {
        return {
            id: this.id,
            name: this.name,
            patterns: this.patterns,
            artist: this.artist,
            filename: this.filename,
            bpm: this.bpm
        };
    }
}
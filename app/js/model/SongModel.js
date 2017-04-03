
import {model} from 'js/model/Model.js';

export default class SongModel {

    constructor(id=false) {
        this.id = id;
        this.name = "";
        this.patterns = [];
        this.artist = "Unknown artist";
        this.saveFileName = false;
    }

    /**
     * This method creates an empty pattern model with new id.
     */
    create() {
        this.id = "song-" + model.next("song.counter");
        this.name = this.id;
        this.patterns = [];
        this.artist = "Unknown artist";
        this.saveFileName = false;
    }

    load() {     
        this.name = model.get("song.name");
        this.id = model.get("song.id");
        this.patterns = model.get("song.patterns");
        this.artist = model.get("song.artist");
        this.saveFileName = model.get("song.savefilename");
    }

    save() {

        model.setMap({
            "song.name": this.name,
            "song.id": this.id,
            "song.artist": this.artist,
            "song.patterns": this.patterns,
            "song.savefilename": this.saveFileName
        });
        

        // model.set("song.id", this.id);
        // model.set("song.name", this.name);
        // model.set("song.patterns", this.patterns);
        // model.set("song.artist", this.artist);
        // model.set("song.savefilename", this.saveFileName);
        
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
            saveFileName: this.saveFileName
        };
    }
}
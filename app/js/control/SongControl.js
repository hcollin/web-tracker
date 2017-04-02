
import { model } from 'js/model/Model';

export class SongControl {

    constructor() {
        
    }

    static create() {

        model.set("channels", {});
        model.set("patterns", {});
        model.set("song.patterns", []);
        model.set("song.name", "Song has no name yet.");
        model.set("song.name", "");
        model.set("play.state", "STOP");
        
        
    }

    addPattern(patternId) {
        model.push("song.patterns", patternId);
    }

    removePattern() {

    }


}
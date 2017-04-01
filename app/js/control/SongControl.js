
import { model } from 'js/model/Model';

export class SongControl {

    constructor() {
        
    }

    create() {
        model.set("song.patterns", []);
        model.set("song.name", "No name");
    }

    addPattern(patternId) {
        model.push("song.patterns", patternId);
    }

    removePattern() {

    }


}
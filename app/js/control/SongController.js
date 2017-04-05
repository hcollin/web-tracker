
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

    openFromFile(fileObject) {     
        // console.log(fileObject.content);
        const nm = JSON.parse(fileObject.content);
        
        nm["song.filename"] = fileObject.name;

        const setOrder= [
            "song.counter",
            "track.counter",
            "channel.counter",
            "pattern.counter",
            "song.name",
            "song.artist",
            "song.id",
            "song.filename"

        ];

        setOrder.forEach((key) => {
            console.log("Setting key: "+key);
            model.set(key, nm[key]);
        });

        function setGroup(key, source) {
            console.log("Setup Group ", key);
            model.gset(key, {});    
            Object.keys(source[key]).forEach(nkey => {
                console.log("Group set: "+ key + "."+nkey, source[key][nkey]);
                model.gset([key, nkey], source[key][nkey]);
            });
        }

        setGroup("channels", nm);
        setGroup("tracks", nm);
        setGroup("patterns", nm);    
        model.set("song.patterns", nm["song.patterns"]);
        

        // The set all audio file data
        const nmKeys = Object.keys(nm);
        nmKeys.forEach(key => {
            if(key.endsWith("audio.file.content")) {
                console.log("Found audio key from saved song!", key);
                model.set(key, nm[key]);
            }
        });


    }

    saveToFile() {
        let modelToBeSaved = model.clone();
        delete modelToBeSaved["view.main.open"];
        let songFileName = this.song.filename && this.song.filename.length > 1 ? this.song.filename : this.song.id + ".json";


        const jsonModel = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(modelToBeSaved));
        let dlAnchorElem = document.getElementById("saveFileLink");
        console.log("saveLinkElement", dlAnchorElem);
        dlAnchorElem.setAttribute("href", jsonModel);
        dlAnchorElem.setAttribute("download", "song.json");
        dlAnchorElem.click();

    }

}
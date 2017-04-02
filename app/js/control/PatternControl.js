
import {model} from 'js/model/Model.js';
import PatternModel from 'js/model/PatternModel.js';


export default class PatternControl {
    
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
            channels: this.pattern.channels,
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
        this.pattern.channels.push({
            notes: [],
            channelId: false
        });
    }

    getAllKeys() {
        const pats = model.get("patterns");
        return Object.keys(pats);
    }


    // static create(targetId=false) {
        
    //     const patId = "pattern-" + ((targetId != false) ? targetId : model.next("pattern.counter"));
    //     const patternData = {
    //         id: patId,
    //         name: patId,
    //         channels: [],
    //         beats: 32
    //     };
    //     console.log("Create Pattern with id " + patId + " : ", patternData);
    //     model.gset(["patterns", patId], patternData);
        
    //     return patternData;
    // }

    // update(values) {
    //     console.log("UPDATE PATTERN", this.id, value)
    //     model.gset(["patterns", this.id], values);
    // }

    // get(id=false) {
    //     if(!id) {
    //         id = this.id;
    //     }
    //     this.data = model.gget(["patterns", id]);
    //     return this.data
    // }

    // set(key, value) {
    //     console.log("SET: ", key, value);
    //     this.get();
    //     this.data[key] = value;
    //     this.update(this.data);
    // }

    // exists(id) {
    //     const patterns = model.get("patterns") ;
    //     const pkeys = Object.keys(patterns);
    //     const ind = pkeys.indexOf(id)
    //     return ind > -1;
        
    // }
    
    // remove(id) {
    //     model.filter("patterns", (item) => {
    //         return item.id != id;
    //     });
    // }

    // getAll() {
    //     return model.get("patterns");
    // }


}
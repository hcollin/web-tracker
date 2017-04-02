
import {model} from 'js/model/Model.js';



export default class PatternControl {
    
    constructor(id=false) {
        this.id = id;
        
    }

    static create(targetId=false) {
        
        const patId = "pattern-" + (targetId != false) ? targetId : model.next("pattern.counter");
        const patternData = {
            id: patId,
            name: "No pattern name",
            channels: [],
            beats: 32
        };
        
        model.gset(["patterns", patId], patternData);
        
        return patternData;
    }

    get(id) {
        return model.gget(["patterns", id]);

        
    }

    exists(id) {
        const patterns = model.get("patterns") ;
        console.log("patterns", patterns);
        
        
        
    }

    remove(id) {
        model.filter("patterns", (item) => {
            return item.id != id;
        });
    }

    getAll() {
        return model.get("patterns");
    }


}
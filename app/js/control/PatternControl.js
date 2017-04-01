
import {model} from 'js/model/Model.js';



export class PatternControl {
    
    constructor(id=false) {
        
        
    }

    create() {
        const patternData = {
            id: model.next("pattern.counter"),
            name: "No pattern name",
            notes: [],
            beats: 32
        };
        
        model.push("patterns", patternData);
        return patternData;
    }

    get(id) {
        const patterns = model.get("patterns");
        patterns.forEach((pat) => {
            console.log("Pat!", pat);
        })
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
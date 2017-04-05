

export class Model {

    constructor() {
        this.data = {};
        this.subs = {};
        this.revision = 0;
        this.DEBUG = false;
        this.history =[];
        this.subIdCounter = 0;
    }

    // DEFAULT METHODS

    /**
     * Reset the current model to this data. Usually only used to set the initial state of the model.
     * @param {Object} data 
     */
    initialize(data) {
        this.data = data;

        console.log(data, Object.keys(data));
        Object.keys(data).forEach(key => {
            this.trigger(key);
        });
        
    }

    /**
     * Get the value of defined key
     */
    get(key=false) {
        if(!key)
            return this.data;
        return this.data[key];
    }

    /**
     * Returns a clone of the key that no longer possess a link to the original model.
     */
    clone(key=false) {
        if(!key) {
            return Object.assign({}, this.data);
        }
        
        if(Array.isArray(this.data[key])) {
            return this.data[key].concat([]);
        }

        return Object.assign({}, this.data[key]);
    }

    /**
     * Data has the defined key
     * @param {*} key 
     */
    hasKey(key) {
        return this.data[key] !== undefined;
    }


    /**
     * Set the value of key
     * @param {*} key 
     */
    set(key, value) {
        this.toHistory("set", key, value);
        this.data[key] = value;
        
        this.trigger(key);
        return this;
    }

    setMap(values) {
        const keys = Object.keys(values);
        keys.forEach((key) => {
            this.data[key] = values[key];
        });
        keys.forEach(key => {
            this.trigger(key);
        });
        return this;
    }

    /**
     * Delete key
     * @param {string} key 
     */
    del(key) {
        this.toHistory("del", key, {});
        delete this.data[key];
        this.trigger(key);
        return this;
    }
    

    // GROUP METHODS

    /**
     * Set a value to a hierarchy based on the key
     * @param {string|arrayOfStrings} key 
     * @param {*} value 
     */
    gset(key, value) {
        const gkeys = Array.isArray(key) ? key : key.split(".");

        function traverse(level, keys, value, target) {
            const lkey = keys[level];
            if(level < (keys.length - 1)) {
                if(target[lkey] === undefined) {
                    target[lkey] = {}
                    return traverse(++level, keys, value, target[lkey]);
                } else {
                    return traverse(++level, keys, value, target[lkey]);
                }
            }
            return target[lkey] = value;
        }
        traverse(0, gkeys, value, this.data);
        this.triggerGroup(gkeys, {action: "GSET", key: gkeys.join("."), value: value});

        return this;
    }

    /**
     * Delete a value from group hierarchy by key
     * @param {string|arrayOfStrings} key 
     */
    gdel(key) {
        const gkeys = Array.isArray(key) ? key : key.split(".");
        const DEBUG = this.debug;
        function traverse(target, level, keys) {
            const lkey = keys[level];
            if(target[lkey] !== undefined) {
                if(level < (keys.length -1)) {
                    return traverse(target[lkey], ++level, keys);
                } else {
                    delete target[lkey];
                    return true;
                }
            } else {
                if(DEBUG) console.error("Cannot remove '" + gkeys.join(".") + "' from model as it does not exist! Failed at key '" + lkey +"'." );
                return false;
            }
        }

        traverse(this.data, 0, gkeys);
        this.triggerGroup(gkeys, {action: "GDEL", key: gkeys.join(".")});
        return this;
    }

    /**
     * Get a value from object hierarchy based on the key
     * @param {string|arrayOfStrings} key 
     */
    gget(key) {
        const gkeys = Array.isArray(key) ? key : key.split(".");
        const DEBUG = this.DEBUG;
        function traverse(target, level, keys) {
            const lkey = keys[level];
            if(target[lkey] !== undefined) {
                if(level < (keys.length -1)) {
                    return traverse(target[lkey], ++level, keys);
                } else {
                    return target[lkey];
                }
            }
            if(DEBUG) console.error("Failed to retreive key '" + key + "' at '" + lkey +"'. No such key found. "+ level + " ");
            return undefined;
        }

        return traverse(this.data, 0, gkeys);

    }


    ghas(key) {
        const gkeys = Array.isArray(key) ? key : key.split(".");
        function traverse(target, level, keys) {
            const lkey = keys[level];
            if(target[lkey] !== undefined) {
                if(level < (keys.length -1)) {
                    return traverse(target[lkey], ++level, keys);
                } else {
                    return true;
                }
            }
            return false;
        }
        return traverse(this.data, 0, gkeys);
    }

    // ARRAY METHODS

    /**
     * Push the value into the array in key
     * @param {*} key 
     */
    push(key, value) {
        this.toHistory("push", key, value);
        if(this.data[key] === undefined) {
            this.data[key] = [];
        }

        this.data[key].push(value);
        this.trigger(key);
    }

    /**
     * Execute the callback function to all values in the array located in the key
     * @param {string} key 
     * @param {function} cb 
     */
    map(key, cb) {
        this.toHistory("map", key, cb);
        this.data[key] = this.data[key].map(cb);
        this.trigger(key);
    }

    /**
     * Filter a array in data location key with callback function.
     * @param {string} key 
     * @param {function} db 
     */
    filter(key, cb) {
        this.toHistory("filter", key, cb);
        this.data[key] = this.data[key].filter(cb);
        this.trigger(key);
    }

    /**
     * Retrive a child from a key value that is an array from position index.
     * @param {string} key 
     * @param {int} index
     */
    aget(key, index) {
        if(this.data[key] === undefined) {
            this.data[key] = [];
        }
        if(this.data[key][index] === undefined) {
            throw Exception("Cannot retrieve index " + index + " from model key "+ key + ". It does not exist.");
            return false;
        }

        return this.data[key][indexid];
    }


    // SPECIAL METHODS

    /**
     * Get the next value for the target key. Used as a counter and starts from 1.
     * 
     * THIS MUST NEVER BE DECREASED!
     * @param {string} key 
     */
    next(key) {
        if(this.data[key] === undefined) {
            this.data[key] = 0;
        }
        return ++this.data[key];
    }

    // SUBSCRIPTION METHODS

    /**
     * Subscribe to the changes in in the given key with provided callback function
     * @param {string} key 
     * @param {function} cb 
     */
    sub(key, cb) {
        if(this.subs[key] === undefined)  {
            this.subs[key] = [];
        }
        
        const subObj = {
            key: "sub-" + this.subIdCounter++,
            callback: cb
        };
        this.subs[key].push(subObj);        
        
        return () => {
            this.unsub(subObj.key, key);
        };
    }    

    unsub(subkey, key) {
        console.log("remove subscription ", key);
        this.subs[key] = this.subs[key].filter((item) => {
            return item.key != subkey;
        });
    }

    /**
     * The target key has changed, trigger events subscribed to that key
     * @param {string} key 
     */
    trigger(key, RETURNVALUE=false) {
        let s = 0;
        if(this.subs[key] !== undefined) {
            let sbCount = this.subs[key].length;
            for(let i = 0; i < sbCount; i++) {
                this.subs[key][i].callback(RETURNVALUE ? RETURNVALUE : this.data[key]);
            }
            s = this.subs[key].length;
        }
        if(!RETURNVALUE && this.DEBUG && this.subs["DEBUGMODEL"] !== undefined) {
            let sbCount = this.subs["DEBUGMODEL"].length;
            for(let i = 0; i < sbCount; i++) {
                this.subs["DEBUGMODEL"][i].callback(this.data, this.revision);
            }
        }
        
        return s;
    }

    triggerGroup(gkey, value) {
        let s = 0;

        let currentKey = "";
        gkey.forEach((item, index) => {
            currentKey += index > 0 ? "." + item : item;
            this.trigger(currentKey, value);
        });

        
        if(this.DEBUG && this.subs["DEBUGMODEL"] !== undefined) {
            let sbCount = this.subs["DEBUGMODEL"].length;
            for(let i = 0; i < sbCount; i++) {
                this.subs["DEBUGMODEL"][i].callback(this.data, this.revision);
            }
        }
        
        return s;
    }

    toHistory(act, key, opts) {
        this.revision++;    // Increment revision counter
        const historyObject = {
            rev: this.revision,
            action: act,
            key: key,
            options: opts
        };
        this.history.push(historyObject);
    }

    //TODO: UnSubscription
}

export let model = new Model();
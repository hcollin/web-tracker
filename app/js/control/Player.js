
import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';

class Player {

    constructor() {

        this.ctx = Pizzicato.context;
    
        this.status = "STOP";
        this.bpm = 120;
        this.location = 0;

        this.stepper = false;

        this.subs = {
            play: [],
            stop: [],
            pause: [],
            step: [],
            all: []
        };
    }

    play() {
        this.status = "PLAY";
        console.debug("player.play() ", this.status);
        this._startStepper();
        
        this.trigger("play");
        this.trigger("all");
    }

    stop() {
        
        this.status = "STOP";
        this._stopStepper();
        this.location = 0;
        
        
        console.debug("player.stop() ", this.status);
        this.trigger("stop");
        this.trigger("all");
    }

    pause() {
        this.status = "PAUSE";
        
        console.debug("player.pause() ", this.status);
        this.trigger("pause");
        this.trigger("all");
    }

    fastforward() {
        console.debug("player.fastforward() ", this.status);
        this.location += 8;
    }

    rewind() {
        console.debug("player.rewind() ", this.status);
        const newLoc = this.location - 8;
        if(newLoc < 0) {
            this.location = 0;
        } else {
            this.location = newLoc;
        }
    }

    onPlay(callback) {
        this.subs.play.push(callback);
    }

    onStop(callback) {
        this.subs.stop.push(callback);
    }

    onPause(callback) {
        this.subs.pause.push(callback);
    }

    onStep(callback) {
        this.subs.step.push(callback);
    }

    onStatusChange(callback) {
        this.subs.play.push(callback);
        this.subs.stop.push(callback);
        this.subs.pause.push(callback);
    }



    // Internal Methods

    _startStepper() {
        // this.stepper = window.setInterval(() => {
        //     if(this.status == "PLAY") {
        //         this.location++;
        //         this.trigger("step");
        //     }
        // }, 1000);
    }

    _stopStepper() {
        // if(this.stepper && this.status != "STOP") {
        //     window.clearInterval(this.stepper);
        //     this.stepper = false;
        // }     
    }

    trigger(type) {
        this.subs[type].forEach((cb) => {
            cb(this);
        });
    }


}


export let player = new Player();
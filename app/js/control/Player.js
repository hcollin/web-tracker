
import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';

import MixerController from 'js/control/MixerController.js';
import ChannelController from 'js/control/ChannelController.js';
import AudioChannelController from 'js/control/AudioChannelController.js';

class Player {

    constructor() {
        this.ctx = Pizzicato.context;
        
        this.status = "STOP";
        this.bpm = 120;
        this.location = 0;

        this.sounds = false;
        this.noteQueue = false;
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
        this._buildSounds();
        const instructions = this._buildInstructions();
        this._startStepper();
        // this._startNoteStepper();
        this.trigger("play");
        this.trigger("all");
    }

    stop() {
        this._stopStepper();
        this.status = "STOP";
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
        this._buildSounds();
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

    _buildInstructions() {
        let instructions = [];
        let noteQueue = [];

        const songPatterns = model.get("song.patterns");
        const patterns = model.get("patterns");
        const tracks = model.get("tracks");
        const channels = model.get("channels");
        const startTime = 0;

        let totalNotes = 0;
        let pStartTime = 0;
        songPatterns.forEach(sp => {
            const p = patterns[sp.patternId];
            const pDur = (60 / this.bpm) * (p.beats/4);
            pStartTime += pDur;
            totalNotes += p.beats;
        });

        console.log("Total Notes ", totalNotes, "\nTotal Duration: ", pStartTime);;
        
        pStartTime = 0;
        let notePatternStart = 0;
        songPatterns.forEach(sp => {
            const p = patterns[sp.patternId];
            const pDur = (60 / this.bpm) * (p.beats/4);
            const bTimeDiff = pDur / p.beats;
            const patternRoot = { pattern: p.id, patternName: p.name };
            p.tracks.forEach(pt => {
                const t = tracks[pt]
                const trackRoot = { channelId: t.channelId, channelName: t.name };
                t.notes.forEach((n, index) => { 
                    const cNote = notePatternStart + index;
                    if(noteQueue[cNote] === undefined)       {
                        noteQueue[cNote] = [];
                    }
                    Object.keys(n).forEach(act => {
                        const note = Object.assign({}, patternRoot, trackRoot, { time: pStartTime + index*bTimeDiff, action: act, value: n[act]});
                        instructions.push(note);
                        noteQueue[cNote].push(note);
                    });
                });
            });
            pStartTime += pDur;
            notePatternStart += p.beats;
        });

        console.log("INSTRUCTIONS:", instructions);
        console.log("NoteQueue", noteQueue);
        this.noteQueue = noteQueue;
        return instructions;
    }

    _buildSounds() {
        let sounds = {};
        let mc = new MixerController();
        const channels = mc.getChannels();
        for(let key in channels) {
            

            // AUDIO CHANNEL
            console.log("KEY", key);
            let cc = new AudioChannelController(key);
            cc.get();
            const audioDataId = cc.getDataId()
            console.log("key", key, cc, audioDataId);
            if(!model.get(audioDataId)) {
                console.error("No sound file loaded for channel " + cc.channel.name);
                return;
            }
            let s =  new Pizzicato.Sound(model.get(audioDataId))
            s.volume = cc.channel.volume/100;
            sounds[key] =s;
        }

        this.sounds = sounds;

    }

    _startStepper() {
        let note = 0;
        const stepWait = ((60/this.bpm)/4)  * 1000;
        const startTime = this.ctx.currentTime;
        this.stepper = window.setInterval(() => {
            if(this.status == "PLAY") {
                // console.log(note, this.noteQueue[note]);
                const notes = this.noteQueue[note];
                const nowTime = this.ctx.currentTime;
                console.log( nowTime - startTime);
                if(notes) {
                    notes.forEach(n => {
                        console.log(n);
                        let s = this.sounds[n.channelId];
                        if(s.playing) {
                            s.stop();
                        }
                        s.play();    
                    }); 
                }
                
                note++;
                if(note > this.noteQueue.length) {
                    this.stop();
                }
            }
            
        }, stepWait);
    }

    _startNoteStepper() {
        let note = 0;
        const startTime = this.ctx.currentTime;
        const noteWait = (((60/this.bpm)/4));
        
        const notesAhead = 2;
        
        // const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);
        const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);
    
        
        const setNotesToPlay = () => {
            if(this.status == "PLAY") {
                for(let i = 0;i < notesAhead; i++) {
                    const notes = this.noteQueue[note];
                    if(notes) {
                        notes.forEach((n) => {
                            let s = this.sounds[n.channelId];
                            
                            const playTime = (startTime + n.time) - this.ctx.currentTime;
                            console.log(note, n, playTime);
                            // s.play(playTime);    
                            s.play();    
                            
                            
                            
                        }); 
                    }
                    note++;
                }
            }
            if(note < this.noteQueue.length) {
                setTimeout(setNotesToPlay, stepWait);
            }
            
            
            
        }
        setTimeout(setNotesToPlay, 0);
    }

    _stopStepper() {
        if(this.stepper && this.status != "STOP") {
            window.clearInterval(this.stepper);
            this.stepper = false;
        }     
    }

    trigger(type) {
        this.subs[type].forEach((cb) => {
            cb(this);
        });
    }


}


export let player = new Player();

import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';

import MixerController from 'js/control/MixerController.js';
import ChannelController from 'js/control/ChannelController.js';
import AudioChannelController from 'js/control/AudioChannelController.js';

class Player {

    constructor() {
        this.ctx = Pizzicato.context;
        
        this.status = "STOP";
        this.bpm = 150;
        this.location = 0;

        this.sounds = false;
        this.noteQueue = false;
        this.stepper = false;

        this.playState = {
            fullDuration: 0,
            currentPosition: 0,
            maxPos: 0,
            pattern: 0,
            stopPlayingEventId: false
        };

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
        const instructions = this._buildInstructions();
        this._buildSounds((sounds) => {
            this.sounds = sounds;
            this._startNoteStepperNew();
        });
        
        // this._startStepper();
        
        this.trigger("play");
        this.trigger("all");
    }

    stop() {
        this._stopStepper();
        this.status = "STOP";
        if(this.playState.stopPlayingEventId) {
            clearTimeout(this.playState.stopPlayingEventId);
            this.playState.stopPlayingEventId = false;
        }
        this.noteQueue = false;
        this.playState.currentPosition = 0;
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

    updateSounds() {
        if(this.status != "STOP"){
            this._buildSounds((sounds) => {
                this.sounds = sounds;
            });
        }
    }

    updateSound(channelId) {
        if(this.status != "STOP") {
            this._buildSounds((sound) => {
                this.sounds[channelId] = sound[0];
                console.log("Sound for channel '" + channelId + "' updated.");
            }, channelId);
        }
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
        const bpm = model.get("song.bpm") ? model.get("song.bpm") : 120;
        this.bpm = bpm;

        const startTime = 0;

        let totalNotes = 0;
        let pStartTime = 0;
        songPatterns.forEach(sp => {
            const p = patterns[sp.patternId];
            const pDur = (60 / bpm) * (p.beats/4);
            pStartTime += pDur;
            totalNotes += p.beats;
        });

        this.playState.fullDuration = pStartTime;
        this.playState.maxPos = totalNotes;
        // console.log("Total Notes ", totalNotes, "\nTotal Duration: ", pStartTime);
        
        pStartTime = 0;
        let notePatternStart = 0;
        songPatterns.forEach(sp => {
            const p = patterns[sp.patternId];
            const pDur = (60 / bpm) * (p.beats/4);
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

        console.log("NoteQueue", noteQueue);
        this.noteQueue = noteQueue;
        return instructions;
    }

    _buildSounds(doneCb=false, targetChannel=false) {
        let sounds = {};
        let mc = new MixerController();
        let tChannel = false;
        if(targetChannel) {
            let cc = new ChannelController(targetChannel);
            tChannel = cc.get();
        }
        
        const channels = targetChannel != false ? [].push(tChannel) : mc.getChannels();
        const channelCount = Object.keys(channels).length;
        let counterForLoaded = 0;
        
        for(let key in channels) {
            
            // AUDIO CHANNEL
            let cc = new AudioChannelController(key);
            cc.get();
            const audioDataId = cc.getDataId()
            if(!model.get(audioDataId)) {
                console.error("No sound file loaded for channel " + cc.channel.name);
                return;
            }
            let s =  new Pizzicato.Sound(model.get(audioDataId), () => {
                counterForLoaded++;
                
                if(cc.channel.mute) {
                    s.volume = 0;
                } else {
                    s.volume = cc.channel.volume/100;    
                }

                // Premade effects

                if(cc.effectOn('distortion')) {
                    const d = new Pizzicato.Effects.Distortion({
                        gain: 0.8
                    });
                    s.addEffect(d)
                }
                
                if(cc.effectOn('reverb')) {
                    const r = new Pizzicato.Effects.Reverb({
                        time: 1,
                        decay: 1.5,
                        reverse: false,
                        mix: 0.4
                    });
                    s.addEffect(r)
                }

                if(counterForLoaded == channelCount) {
                    if(doneCb) {
                        doneCb(sounds);
                    }
                }
            });
            
            sounds[key] = s;
        }

        // this.sounds = sounds;
        return sounds;

    }

    /**
     * Build notes two notes before they are actually played
     * @private
     */
    _startNoteStepperNew() {
        let note = 0;
        const startTime = this.ctx.currentTime;
        const noteWait = (((60/this.bpm)/4));
        const notesAhead = 1;


        const beatWaitInMs = (noteWait * 1000);
        const adjuster = beatWaitInMs < 160 ? true : false;
        const preSteps = beatWaitInMs < 120 ? 3 : 2;


        // const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);
        const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);

        // console.log("startNoteStepper NEW: ", beatWaitInMs, stepWait, noteWait, startTime, note, notesAhead, this.noteQueue.length, this.bpm);
        console.log("Start Note Stepper:\n\tBeatsWaitInMs", beatWaitInMs, "\n\tnoteWait:", noteWait,"\n\tnoteQueue:", this.noteQueue.length,"\n\tbpm:", this.bpm,"\n\tadjuster:", adjuster,"\n\tpre Steps: ", preSteps);

        const setNotesToPlay = () => {
            const now = Math.round((this.ctx.currentTime - startTime)*1000);
            const shouldBe = Math.round(note*beatWaitInMs);
            const lagging = now > shouldBe;
            const lagwarn = now+(beatWaitInMs/2) > shouldBe;

            // console.log("Note: ", note, " NOW: ", now+ " / "+ shouldBe, lagwarn ? "WARN" : "", lagging ?"LAG": "");
            if(this.status == "PLAY") {
                for(let i = 0;i < notesAhead; i++) {
                    const notes = this.noteQueue[note];
                    if(notes) {
                        notes.forEach((n) => {
                            let s = this.sounds[n.channelId].clone();
                            const playTime = (startTime + n.time) - this.ctx.currentTime;
                            s.play(playTime);
                        });
                    }
                    note++;

                }
                this.playState.currentPosition = note;
                this.trigger("step");
            }

            if(note < this.noteQueue.length) {


                if(note < preSteps) {
                    setTimeout(setNotesToPlay, 0);
                } else {
                    if(note === preSteps && adjuster) {
                        setTimeout(setNotesToPlay, beatWaitInMs - beatWaitInMs/2);
                    } else {
                        if(lagwarn) {
                            if(lagging) {
                                setTimeout(setNotesToPlay, 0);
                            } else {
                                setTimeout(setNotesToPlay, beatWaitInMs/2);
                            }

                        } else {
                            setTimeout(setNotesToPlay, beatWaitInMs);
                        }

                    }

                }


            }

        };

        setTimeout(setNotesToPlay, 0);

        this.playState.stopPlayingEventId = setTimeout(() => {
            if(this.status != "STOP") {
                this.stop();
            }
        }, this.playState.fullDuration * 1000);
    }

    _startNoteStepper() {
        let note = 0;
        const startTime = this.ctx.currentTime;
        const noteWait = (((60/this.bpm)/4));

        const notesAhead = noteWait > 200 ? 1 : 2;


        
        // const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);
        const stepWait = Math.round(((noteWait * notesAhead) - (noteWait/1.5))*1000);

        console.log("startNoteStepper", stepWait, startTime, note, notesAhead, this.noteQueue.length);
        const setNotesToPlay = () => {
            if(this.status == "PLAY") {
                for(let i = 0;i < notesAhead; i++) {
                    const notes = this.noteQueue[note];
                    if(notes) {
                        notes.forEach((n) => {
                            let s = this.sounds[n.channelId].clone();
                            const playTime = (startTime + n.time) - this.ctx.currentTime;
                            s.play(playTime);    
                        }); 
                    }
                    note++;
                }
            }
            if(note < this.noteQueue.length) {
                console.log("Set Notes", this.ctx.currentTime);
                setTimeout(setNotesToPlay, stepWait);
            }

        };

        setTimeout(setNotesToPlay, 0);

        this.playState.stopPlayingEventId = setTimeout(() => {
            if(this.status != "STOP") {
                this.stop();
            }
        }, this.playState.fullDuration * 1000);
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

console.log("Audio worker started!");

var bpm = 120;
var notesPerBeat = 4;
var ticker = false;
var instructions = false;
var channels = {};

var ctx = false;

function play(inst) {

    ctx = new AudioContext();
    instructions = inst; 
    const beatWait = 60 / bpm;
    const noteWait = beatWait / 4;
    const noteWaitAsMS = noteWait * 1000;
    if(!ticker) {
        ticker = setInterval(function(){
            console.log("Tick", ctsx.currentTime)
        }, noteWaitAsMS);
    }
}

function stop() {
    if(ticker) {
        clearInterval(ticker);
        ticker = false;
    }
}

function pause() {

}

function setupChannel() {

}



onmessage = function(e) {
    console.log("Work! Work!", e.data);

    switch(e.data[0]) {
        case "PLAY": 
            play(e.data[1]);
            break;
        case "STOP":
            stop();
            break;
        case "PAUSE":
            pause();
            break;
        case "CHANNELSETUP":
            setupChannel(e.data[1]);
            break;
    }

}


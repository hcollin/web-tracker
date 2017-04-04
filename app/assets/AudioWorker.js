
console.log("Audio worker started!");


var ticker = false;

function play() {
    if(!ticker) {
        ticker = setInterval(function(){
            console.log("Tick!");
        }, 1000);
    }
}

function stop() {
    if(ticker) {
        clearInterval(ticker);
    }
}

function pause() {

}



onmessage = function(e) {
    console.log("Work! Work!", e.data);

    switch(e.data) {
        case "PLAY": 
            play();
            break;
        case "STOP":
            stop();
            break;
        case "PAUSE":
            pause();
            break;
    }

}


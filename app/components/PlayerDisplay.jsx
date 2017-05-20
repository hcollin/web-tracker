import React from 'react';

import { model } from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

export default class PlayerDisplay extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let statusImg = "imgs/stop.svg";
        if(this.props.player.status === "PLAY") {
            statusImg = "imgs/play.svg";
        }

        if(this.props.player.status === "PAUSE") {
            statusImg = "imgs/pause.svg";
        }
        console.log("Render Display: ", player.playState);
        const duractionSecs =  Math.round(this.props.player.playState.fullDuration * 100)/100;
        const mins = Math.floor(duractionSecs / 60);
        const secs = Math.floor(duractionSecs - (mins * 60));
        const mss = Math.round((duractionSecs - (mins*60) - secs)*1000);

        const curPos = this.props.player.playState ? this.props.player.playState.currentPosition : 0;
        const maxPos = this.props.player.playState ? this.props.player.playState.maxPos : 0;
        return(
            <div className="player-display">
                <img src={statusImg} className="player-display-status-img"/>
                <h4 className="player-display-song-name">{this.props.songName}</h4>
                <p className="player-display-current-position">{curPos} / {maxPos}</p>
                <p className="player-display-song-duration">{mins}:{secs < 10 ? "0" + secs : secs}.{ ("000" + mss).slice(-3) }</p>
            </div>
        )
    }
}
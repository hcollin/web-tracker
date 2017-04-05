
import React from 'react';

import { model } from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

import SongController from 'js/control/SongController.js';

import ChannelButton from './ChannelButton.jsx';

export default class MainHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "no name",
            author: "Unknow artist",
            status: "STOP",
            playerContainer: player
        }
        this.newSong = this.newSong.bind(this);
        this.showSettings = this.showSettings.bind(this);
    }

    componentDidMount() {
        model.sub("song.name", (val) => {
            this.setState({
                name: val
            });
        });

        model.sub("song.artist", (val) => {
            
            this.setState({
                author: val
            });
        });

        player.onStatusChange((pla) => {
            this.setState({
                playerContainer: pla
            });
        });

        player.onStep((pla) => {
            console.log("onStep", pla);
            this.setState({
                playerContainer: pla
            });
        });

        
    }

    newSong() {
        let songController = new SongController();
        songController.create();
    }

    playSong() {
        player.play();
    }

    stopSong() {
        player.stop();
    }

    pauseSong() {
        player.pause();
    }

    forwardSong() {
        player.fastforward();
    }

    rewindSong() {
        player.rewind();
    }

    showSettings() {
        console.log("MODEL:", model.get());
    }

    render() {
        return (
        <div className="layout-header el-bg-default">
          <h1>Web Tracker</h1>
          
          <div className="header-player-info">
            <span>{player.location}</span>  
          </div>



          {/*<div className="header-song-info">
            <h3>{this.state.name}</h3>
            <p>{this.state.author}</p>
            
          </div>*/}

          <div className="header-player-controls">
            {/*<ChannelButton clicked={this.newSong} icon="imgs/plus.svg" />*/}
            <ChannelButton clicked={this.rewindSong} icon="imgs/rewind.svg" />
            { (player.status == "PLAY") &&
                <ChannelButton clicked={this.pauseSong} icon="imgs/pause.svg"  disabled={player.status == "STOP"} />
            }
            { (player.status != "PLAY") && 
                <ChannelButton clicked={this.playSong} icon="imgs/play.svg" disabled={player.status == "PLAY"} />
            }
            <ChannelButton clicked={this.stopSong} icon="imgs/stop.svg"  disabled={player.status == "STOP"} />
            <ChannelButton clicked={this.forwardSong} icon="imgs/fastforward.svg" />
            <ChannelButton clicked={this.showSettings} icon="imgs/debug.svg" />
        
          </div>

        </div>
        );
    }
}

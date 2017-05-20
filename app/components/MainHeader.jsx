
import React from 'react';

import { model } from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

import SongController from 'js/control/SongController.js';


import ChannelButton from './ChannelButton.jsx';
import PlayerDisplay from './PlayerDisplay.jsx';


export default class MainHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "no name",
            author: "Unknow artist",
            status: "STOP",
            playerContainer: player
        };
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
            <PlayerDisplay player={player} songName={this.state.name} />
          </div>



          {/*<div className="header-song-info">
            <h3>{this.state.name}</h3>
            <p>{this.state.author}</p>
            
          </div>*/}

          <div className="header-player-controls">
              <ChannelButton clicked={this.playSong} icon="imgs/play.svg" disabled={player.status == "PLAY"} />
              <ChannelButton clicked={this.stopSong} icon="imgs/stop.svg"  disabled={player.status == "STOP"} />
          </div>

        </div>
        );
    }
}


import React from 'react';

import { model } from 'js/model/Model.js';

import { SongControl } from 'js/control/SongControl.js';
import SongController from 'js/control/SongController.js';

import ChannelButton from './ChannelButton.jsx';

export default class MainHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "no name",
            author: "Unknow artist",
            status: "STOP"
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
    }

    newSong() {
        let songController = new SongController();
        songController.create();
    }

    playSong() {

    }

    showSettings() {
        console.log("MODEL:", model.get());
    }

    render() {
        return (
        <div className="layout-header el-bg-default">
          <h1>Web Tracker</h1>
          <div className="buttons">
            <ChannelButton clicked={this.newSong} icon="imgs/newsong.svg" />
            <ChannelButton clicked={this.playSong} icon="imgs/open.svg" />
            <ChannelButton clicked={this.playSong} icon="imgs/save.svg" />
            <ChannelButton clicked={this.showSettings} icon="imgs/settings.svg" />
          </div>

          <div className="header-song-info">
            <h3>{this.state.name}</h3>
            <p>{this.state.author}</p>
          </div>

        </div>
        );
    }
}

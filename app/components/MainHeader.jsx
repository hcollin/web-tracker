
import React from 'react';

import { model } from 'js/model/Model.js';
import { SongControl } from 'js/control/SongControl.js';

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
    }

    ComponentDidMount() {
        model.sub("song.name", (val) => {
            console.log("new name", val);
            this.setState({
                name: val
            });
        });
    }

    newSong() {
        
        SongControl.create();
        console.log("new Song", model.get());
    }

    playSong() {

    }

    render() {
        return (
        <div className="layout-header el-bg-default">
          <h1>Web Tracker</h1>
          <div className="buttons">
            <ChannelButton clicked={this.newSong} icon="imgs/newsong.svg" />
            <ChannelButton clicked={this.playSong} icon="imgs/open.svg" />
            <ChannelButton clicked={this.playSong} icon="imgs/save.svg" />
            <ChannelButton clicked={this.playSong} icon="imgs/settings.svg" />
          </div>

          <div className="header-song-info">
            <h3>{this.state.name}</h3>
            <p>{this.state.author}</p>
          </div>

        </div>
        );
    }
}

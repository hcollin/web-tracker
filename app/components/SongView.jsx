
import React from 'react';

import {model} from 'js/model/Model.js';

import SongController from 'js/control/SongController.js';
import ChannelButton from './ChannelButton.jsx';
import EditableText from './EditableText.jsx';


export default class SongView extends React.Component {

    constructor(props) {
        super(props);
        this.ctrl = new SongController();
        
        this.state = {
            song: this.ctrl.get(),
            patternList: []
        };

        this.stub = this.stub.bind(this);
        this.saveSongName = this.saveSongName.bind(this);
        this.saveSongArtist = this.saveSongArtist.bind(this);
        
    }

    componentDidMount() {

        model.sub("song.name", (value) => {
            this.setState({
                song: this.ctrl.get()
            });
        });

        model.sub("song.artist", (value) => {
            this.setState({
                song: this.ctrl.get()
            });
        });

        model.sub("song.patterns", (value) => {
            this.setState({
                song: this.ctrl.get()
            });
        });

        model.sub("patterns", () => {
            // console.log("patterns changed");
        });

        this.ctrl.initialize();
    }

    saveSongName(value) {
        this.ctrl.set("name", value);
        this.ctrl.update();
    }

    saveSongArtist(value) {
        this.ctrl.set("artist", value);
        this.ctrl.update();
    }

    stub() {

    }

    render() {
        const classes = this.props.open ? "layout-view song-view layout-view-open" : "layout-view song-view";
        return (
            <div id="songview" className={classes}>
                <header onClick={this.props.openViewHandler} value="song-view">
                    <h2>Song</h2>
                </header>

                <div className="song-editor">

                    <div className="song-toolbar-container  el-bg-light toolbar">
                        <ChannelButton icon="imgs/open.svg" clicked={this.stub} />
                        <ChannelButton icon="imgs/save.svg" clicked={this.stub} />
                        <span className="divider"></span>
                        <ChannelButton icon="imgs/play.svg" clicked={this.stub} />
                        <ChannelButton icon="imgs/stop.svg" clicked={this.stub} />
                        <ChannelButton icon="imgs/pause.svg" clicked={this.stub} />
                        <ChannelButton icon="imgs/rec.svg" clicked={this.stub} />
                    </div>

                    <div className="song-info-container el-bg-light">

                            <div className="row">
                                <div className="col-1 el-bg-default name">Name:</div>
                                <div className="col-3 value">
                                    <EditableText editConfirmed={this.saveSongName} text={this.state.song.name} showButtons={true} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-1 el-bg-default name">Author:</div>
                                <div className="col-3 value">
                                    <EditableText editConfirmed={this.saveSongArtist} text={this.state.song.artist} showButtons={true} />
                                </div>
                            </div>
                    </div>


                    <div className="song-patterns-container el-bg-light">
                        Pattern container
                    </div>
                </div>

                
            </div>
        );
    }
}
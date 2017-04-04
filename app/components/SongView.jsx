
import React from 'react';

import {model} from 'js/model/Model.js';

import SongController from 'js/control/SongController.js';
import ChannelButton from './ChannelButton.jsx';
import EditableText from './EditableText.jsx';

import SongPattern from './SongPattern.jsx';


export default class SongView extends React.Component {

    constructor(props) {
        super(props);
        this.ctrl = new SongController();
        
        this.state = {
            song: this.ctrl.get(),
            patternList: [],
            patterns: {}
        };

        this.stub = this.stub.bind(this);
        this.saveSongName = this.saveSongName.bind(this);
        this.saveSongArtist = this.saveSongArtist.bind(this);

        this.addNewPattern = this.addNewPattern.bind(this);
        
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
            
            let patternList = [];
            const patterns = model.get("patterns");

            for(let pid in patterns) {
                if(patterns.hasOwnProperty(pid)) {
                    const pattern = patterns[pid];
                    patternList.push({id: pattern.id, name: pattern.name});
                }
            }
            this.setState({
                patternList: patternList
            });

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

    addNewPattern() {
        if(this.state.patternList.length > 0) {
            const fPatId = this.state.patternList[0].id;
            this.ctrl.addPattern(fPatId);
        }
        
    }

    stub() {

    }

    render() {
        const classes = this.props.open ? "layout-view song-view layout-view-open" : "layout-view song-view";
        const patternsInSong = this.state.song.patterns ? this.state.song.patterns : [];
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
                        
                        <div className="song-pattern-list">
                            
                            {patternsInSong.map((item, index) => (
                                <SongPattern key={item.id} item={item} index={index} patternList={this.state.patternList} />
                            ))}

                            <div className="add-new">
                                <p>Add new pattern to song</p>
                                <ChannelButton clicked={this.addNewPattern} icon="imgs/plus.svg" />
                                
                            </div>
                            
                        </div>

                    </div>
                </div>

                
            </div>
        );
    }
}

import React from 'react';

import {model} from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

import SongController from 'js/control/SongController.js';
import ChannelButton from './ChannelButton.jsx';
import FileLoadButton from './FileLoadButton.jsx';
import EditableText from './EditableText.jsx';

import DropDown from './DropDown.jsx';

import SongPattern from './SongPattern.jsx';


export default class SongView extends React.Component {

    constructor(props) {
        super(props);
        this.ctrl = new SongController();
        
        this.state = {
            song: this.ctrl.get(),
            patternList: [],
            patterns: {},
            selected: "pattern-2"
        };

        this.stub = this.stub.bind(this);
        this.saveSongName = this.saveSongName.bind(this);
        this.saveSongArtist = this.saveSongArtist.bind(this);
        this.saveFileName = this.saveFileName.bind(this);
        this.saveBpm = this.saveBpm.bind(this);

        this.saveSong = this.saveSong.bind(this);
        this.loadSong = this.loadSong.bind(this);


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

        model.sub("song.filename", (value) => {
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

    saveFileName(value) {
        this.ctrl.set("filename", value);
        this.ctrl.update();
    }

    saveBpm(value) {
        value = parseInt(value.replace(/\D/g,''));
        value = value < 30 ? 30 : value;
        value = value > 250 ? 250 : value;

        this.ctrl.set("bpm", value);
        this.ctrl.update();
        player.justBuild();
    }


    addNewPattern() {
        if(this.state.patternList.length > 0) {
            const fPatId = this.state.patternList[0].id;
            this.ctrl.addPattern(fPatId);
        }
        
    }

    saveSong() {
        this.ctrl.saveToFile();
    }

    loadSong(fileObject) {
        console.log("File Object", fileObject);
        this.ctrl.openFromFile(fileObject);
        console.log("BUILD!!!");
        player.justBuild();

    }

 
    stub(e) {
        console.log("Event", e.target.value);
        this.setState({
            selected: e.target.value
        });
    }

    render() {
        const classes = this.props.open ? "layout-view song-view layout-view-open" : "layout-view song-view";
        const patternsInSong = this.state.song.patterns ? this.state.song.patterns : [];
        return (
            <div id="songview" className={classes}>
                <header onClick={this.props.openViewHandler} value="song-view">
                    <h2 value="song-view">Song</h2>
                </header>

                <div className="song-editor">

                    <div className="song-toolbar-container  el-bg-light toolbar">
                        <FileLoadButton id="load-song-id" fileLoaded={this.loadSong} mimes=".json" datatype="text" />
                        <ChannelButton icon="imgs/save.svg" clicked={this.saveSong} />
                        <span className="divider"></span>
                        {/*<ChannelButton icon="imgs/play.svg" clicked={this.stub} />*/}
                        {/*<ChannelButton icon="imgs/stop.svg" clicked={this.stub} />*/}
                        {/*<ChannelButton icon="imgs/pause.svg" clicked={this.stub} />*/}
                        {/*<ChannelButton icon="imgs/rec.svg" clicked={this.stub} />*/}
                    </div>

                    <div className="song-info-container el-bg-light">
                        <div className="columns">
                            <div className="column">
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

                            <div className="column">

                                <div className="row">
                                    <div className="col-1 el-bg-default name">File Name:</div>
                                    <div className="col-3 value">
                                        <EditableText editConfirmed={this.saveFileName} text={this.state.song.filename} showButtons={true} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-1 el-bg-default name">Beats per Minute:</div>
                                    <div className="col-3 value">
                                        <EditableText editConfirmed={this.saveBpm} text={this.state.song.bpm} showButtons={true} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="song-patterns-container el-bg-light">
                        
                        <div className="song-pattern-list">
                            
                            {patternsInSong.map((item, index) => (
                                <SongPattern key={index} id={item.id} item={item} index={index} patternList={this.state.patternList} />
                            ))}

                            <div className="add-new">
                                <p>Add new pattern to song</p>
                                <ChannelButton clicked={this.addNewPattern} icon="imgs/plus.svg" />
                                
                            </div>
                            
                        </div>

                    </div>
                </div>

                <a id="saveFileLink" style={{display: "none"}} />
            </div>
        );
    }
}
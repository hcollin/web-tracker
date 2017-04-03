
import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import InfoDisplay from './InfoDisplay.jsx';
import EditableText from './EditableText.jsx';
import Track from './Track.jsx';

import { model } from 'js/model/Model.js';
import PatternController from 'js/control/PatternController.js';
import TrackController from 'js/control/TrackController.js';

export default class PatternView extends React.Component {

    constructor(props) {
        super(props);

        this.ctrl = new PatternController();

        this.state = {
            patternList: [],
            index: 0,
            pattern: {}
        };

        this.dummy = "DUMMY STUB"

        this.newPattern = this.newPattern.bind(this);
        this.nextPattern = this.nextPattern.bind(this);
        this.prevPattern = this.prevPattern.bind(this);
        this.changeName = this.changeName.bind(this);
        this.loadPattern = this.loadPattern.bind(this);
        this.noteTrackChanged = this.noteTrackChanged.bind(this);
        this.newTrack = this.newTrack.bind(this);
        this.debugView = this.debugView.bind(this);

    }

    componentDidMount() {
        model.sub("patterns", () => {
            // console.log("Update patternlist if necessary\n", model.get(), "\n",this.ctrl.getAllKeys());
            this.setState({
                patternList: this.ctrl.getAllKeys()
            }, this.loadPattern);
            
        });

        // This subscript should probably be elsewhere so that tracks attached to this pattern would be removed anyways.
        model.sub("tracks", val => {
            if(val.action == "GDEL") {
                const gkeys = val.key.split(".");
                const key = gkeys[1];
                if(this.state.pattern.tracks.indexOf(key) > -1) {
                    this.ctrl.removeTrack(key)
                }
            }
        });

        this.ctrl.initialize();

        let tc = new TrackController();
        tc.initialize();
    }

    newPattern() {
         this.ctrl.create();
    }

    loadPattern() {
        
        const pattern = this.ctrl.get(this.state.patternList[this.state.index]);
        this.setState({
            pattern: pattern
        });
    }

    nextPattern() {
        const newIndex = this.state.index + 1;
        this.setState({
            index: newIndex
        }, this.loadPattern);
    }

    prevPattern() {
        if(this.state.index > 0) {
            this.setState({
                index: this.state.index - 1
            }, this.loadPattern);
        }
    }

    changeName(newName) {
        this.ctrl.set("name", newName);
        this.ctrl.update();
    }

    newTrack() {
        this.ctrl.addNewTrack();   
    }

    noteTrackChanged(index, values) {
        // this.ctrl.updateNoteTrack(index, values);
    }

    debugView() {
        console.debug("Current Pattern\n", this.state.pattern);
        console.debug("All Patterns in model\n", model.get("patterns"));
    }

    stub(e) {
        console.log("PatternView.stub() clicked by ", e.target);
    }


    render() {
        const classes = this.props.open ? "layout-view pattern-view layout-view-open" : "layout-view pattern-view";        
        const tracks = this.state.pattern.tracks !== undefined ? this.state.pattern.tracks : [];
        return (
            <div id="patternview" className={classes}>
                <header onClick={this.props.openViewHandler} value="pattern-view">
                    <h2>Patterns</h2>
                </header>
                <div className="pattern-editor">
                    <div className="el-bg-light toolbar pattern-toolbar">
                        <ChannelButton clicked={this.prevPattern} disabled={this.state.index == 0} icon="imgs/arrow-left.svg" />
                        <EditableText text={this.state.pattern.name} editConfirmed={this.changeName} />
                        <ChannelButton clicked={this.nextPattern} icon="imgs/arrow-right.svg" disabled={this.state.index >= (this.state.patternList.length -1)} />
                        <ChannelButton clicked={this.newPattern} icon="imgs/plus.svg" />
                        <span className="divider" />
                        <ChannelButton clicked={this.stub} icon="imgs/delete.svg" />
                        <span className="divider" />
                        <ChannelButton clicked={this.newTrack} icon="imgs/plus.svg" />
                        <span className="divider" />
                        <ChannelButton clicked={this.debugView} icon="imgs/debug.svg" />
                    </div>
                    {/*<PatternNotes key={index} notes={item} beats={this.state.pattern.beats} pattern={this.state.pattern.id} index={index} onChange={this.noteTrackChanged} />*/}
                    <div className="pattern-notes-container">
                        { tracks.map((item, index) => (
                            <Track key={item} trackid={item} onChange={this.noteTrackChanged} />
                        ))}
                        
                    </div>
                </div>
                
            </div>
        );
    }
}
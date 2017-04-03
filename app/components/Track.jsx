import React from 'react';

import { model } from 'js/model/Model.js';

import TrackController from 'js/control/TrackController.js';

import PatternController from 'js/control/PatternController.js';
import MixerController from 'js/control/MixerController.js';
import ChannelController from 'js/control/ChannelController';

import Note from './Note.jsx';
import ChannelButton from './ChannelButton.jsx';
import ModalConfirm from './ModalConfirm.jsx';

export default class Track extends React.Component {

    constructor(props) {
        super(props);
        // console.log("PatternNotes ", this.props);

        this.mixer = new MixerController();
        this.ctrl = new TrackController(this.props.trackid);
        this.ctrl.get();
        
        this.state = {
            channelList: this.mixer.getChannelsAsList(),
            channelIndex: -1,
            channelInfo: false,
            track: this.ctrl.get(),
            deleteTrackModalOpen: false            
        }

        this.nextChannel = this.nextChannel.bind(this);
        this.prevChannel = this.prevChannel.bind(this);
        this.noteAction = this.noteAction.bind(this);

        this.clickDeleteTrack = this.clickDeleteTrack.bind(this);
        this.deleteTrack = this.deleteTrack.bind(this);

        this.showDebug = this.showDebug.bind(this);
    }

    componentDidMount() {

        model.sub("channels", (val) => {
            const channels = this.mixer.getChannelsAsList();
            let newState = {};
            if(channels.length != this.state.channelList.length ){
                newState["channelList"] = channels;
            }
            if(val.value.id == this.state.channelInfo.id && val.value.name != this.state.channelInfo.name) {
                let cc = new ChannelController(val.value.id);
                newState["channelInfo"] = cc.get();
            }
            
            if(Object.keys(newState).length > 0) {
                this.setState(newState);
            }
            
        });

        // const trackSubKey = "tracks."+this.state.track.id;
        // console.log("sub to " + trackSubKey);
        // model.sub(trackSubKey, (val) => {
        //     console.log("track ", this.state.track.id, " changed!");
        // });

        this.mixer.initialize();
    }

    settings() {
        console.log("Settings");
    }

    update() {
        const newValues = Object.assign({}, this.props.notes, {channelId: this.state.channelInfo.id}, {notes: this.state.notes});
        this.props.onChange(this.props.index, newValues);
        
    }

    nextChannel() {
        const newIndex = this.state.channelIndex >= this.state.channelList.length -1 ? 0 : this.state.channelIndex + 1;
        const newInfo = this.state.channelList[newIndex];
        
        this.ctrl.set("channelId", newInfo.id);
        this.ctrl.update();

        this.setState({
            channelIndex: newIndex,
            channelInfo: newInfo,
            track: this.ctrl.get()
        },this.update);
        
    }

    prevChannel() {
        let newIndex = this.state.channelIndex > 0 ? this.state.channelIndex - 1 : this.state.channelList.length -1;
        if( newIndex < 0 ) {
            newIndex = 0;
        }
        const newInfo = this.state.channelList[newIndex];

        this.ctrl.set("channelId", newInfo.id);
        this.ctrl.update();

        this.setState({
            channelIndex: newIndex,
            channelInfo: newInfo,
            track: this.ctrl.get()
        },this.update);
    }

    clickDeleteTrack() {
        this.setState({
            deleteTrackModalOpen: true
        });
    }

    deleteTrack() {
        this.ctrl.remove();
        this.setState({
            deleteTrackModalOpen: false,
            deleted: true
        });

    }

    showDebug() {
        console.debug("Patten Note\nState: ", this.state, "\nProps: ", this.props);
    }

    noteAction(index, action, values=false) {
        switch(action) {
            case "PLAY":
                this.ctrl.setNote(index, { start: true });
                break;
            case "STOP":
                this.ctrl.setNote(index, { stop: true });
                break;
            case "EMPTY":
                this.ctrl.setNote(index, {});
            default:
                break;
        }

        this.setState({
            track: this.ctrl.get()
        });
    }

    render() {
        if(this.state.deleted) {
            return null;
        }
        const channelName = this.state.channelInfo.name ? this.state.channelInfo.name : (this.state.track.channelId ? this.state.track.channelId : "no channel yet");
        console.log("channelName", channelName, this.state.channelInfo);
        const notes = this.state.track.notes;
        return (
            <div className="pattern-notes el-bg-light">
                <header className="el-bg-default">
                    <ChannelButton clicked={this.prevChannel} icon="imgs/arrow-left.svg" disabled={this.state.channelList.length == 0} />
                    <p>{channelName}</p>
                    <ChannelButton clicked={this.nextChannel} icon="imgs/arrow-right.svg" disabled={this.state.channelList.length == 0} />
                </header>
                <section>
                    {notes.map((note, index) => {
                        const large = (index % 4) == 0;
                        const key = index;
                        return (
                        <Note key={key} note={note} large={large} index={index} action={this.noteAction}/>
                    )})}
                </section>
                <footer>
                    <ChannelButton clicked={this.clickDeleteTrack} icon="imgs/delete.svg" />
                    <ChannelButton clicked={this.showDebug} icon="imgs/debug.svg" />
                </footer>

                <ModalConfirm open={this.state.deleteTrackModalOpen} title="Warning!" text="Delete this track?" handleOk={this.deleteTrack} handleCancel={() => { this.setState({deleteTrackModalOpen: false}); }} />

            </div>
        );
    }

}
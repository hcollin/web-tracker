import React from 'react';

import { model } from 'js/model/Model.js';

import PatternController from 'js/control/PatternController.js';
import MixerController from 'js/control/MixerController.js';

import ChannelButton from './ChannelButton.jsx';
import Note from './Note.jsx';
import ModalConfirm from './ModalConfirm.jsx';

export default class PatternNotes extends React.Component {

    constructor(props) {
        super(props);
        // console.log("PatternNotes ", this.props);

        this.mixer = new MixerController();

        this.ctrl = new PatternController(this.props.notes.pattern);

        this.state = {
            channelList: this.mixer.getChannelsAsList(),
            channelIndex: 0,
            channelInfo: false,
            notes: this.props.notes.notes,
            deleteTrackModalOpen: false            
        }

        this.nextChannel = this.nextChannel.bind(this);
        this.prevChannel = this.prevChannel.bind(this);
        this.noteAction = this.noteAction.bind(this);

        this.clickDeleteTrack = this.clickDeleteTrack.bind(this);
        this.deleteTrack = this.deleteTrack.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("\nUpdate note track?\nPROPS\nN:", nextProps,"\nO:", this.props, "\nSTATE\nN:", nextState, "\nO:",this.state);
        return true;
    }

    componentDidMount() {

        model.sub("channels", (val) => {
            const channels = this.mixer.getChannelsAsList();
            //TODO: This might need some sorting so that it won't trigger everytime there is a change in a channel  
            this.setState({
                channelList: channels
            });
        });
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
        this.setState({
            channelIndex: newIndex,
            channelInfo: newInfo
        },this.update);
        
    }

    prevChannel() {
        let newIndex = this.state.channelIndex > 0 ? this.state.channelIndex - 1 : this.state.channelList.length -1;
        if( newIndex < 0 ) {
            newIndex = 0;
        }
        const newInfo = this.state.channelList[newIndex];
        this.setState({
            channelIndex: newIndex,
            channelInfo: newInfo
        },this.update);
    }

    clickDeleteTrack() {
        this.setState({
            deleteTrackModalOpen: true
        });
    }

    deleteTrack() {
        console.log("Delete track!", this.props.index);
        this.ctrl.removeNoteTrack(this.props.index);
        this.setState({
            deleteTrackModalOpen: false
        });

    }

    noteAction(index, action, values=false) {
        
        // This is so ugly it makes my eyes HURT! But it seems to be the easiest and fastest way to make a copy of a
        // nested object hierarchy...
        let newNotes = JSON.parse(JSON.stringify(this.state.notes));
        
        switch(action) {
            case "PLAY":
                newNotes[index].start = true;
                newNotes[index].stop = false;
                break;
            case "STOP":
                newNotes[index].start = false;
                newNotes[index].stop = true;
                break;
            case "EMPTY":
                newNotes[index].start = false;
                newNotes[index].stop = false;
                break;
            default:
                break;
        }
    
        this.setState({
            notes: newNotes
        }, this.update());
        
    }

    render() {
        // console.log("Notes channel", this.state.channelIndex, this.props.index, this.state.channelId, this.state.channelInfo);
        const channelName = this.state.channelInfo.name ? this.state.channelInfo.name : (this.props.notes.channelId ? this.props.notes.channelId : "no channel yet");
        // const notes = this.props.notes.notes;
        const notes = this.state.notes;
        console.log("Redraw notes", this.props.notes, this.props.notes.pattern);
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
                        const key = this.props.notes.pattern + "-" + index + "-" +note;
                        return (
                        <Note key={key} note={note} large={large} index={index} action={this.noteAction}/>
                    )})}
                </section>
                <footer>
                    <ChannelButton clicked={this.clickDeleteTrack} icon="imgs/delete.svg" />
                </footer>

                <ModalConfirm open={this.state.deleteTrackModalOpen} title="Warning!" text="Delete this track?" handleOk={this.deleteTrack} handleCancel={() => { this.setState({deleteTrackModalOpen: false}); }} />

            </div>
        );
    }

}
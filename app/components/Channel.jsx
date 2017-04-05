import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';

import ChannelController from 'js/control/ChannelController.js';
import AudioChannelController from 'js/control/AudioChannelController.js';

import EditableText from './EditableText.jsx';
import ModalConfirm from './ModalConfirm.jsx';


export default class Channel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.ctrl = new AudioChannelController(this.props.channelId);
        
        this.state = {
            channel: {},
            deleteChannelModalOpen: false,
            loading: false
        };

        this.sound = false;

        this.confirmLabel = this.confirmLabel.bind(this);
        this.openFile = this.openFile.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.deleteChannelHandler = this.deleteChannelHandler.bind(this);
        this.testSound = this.testSound.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.mute = this.mute.bind(this);

        this.dummyStub = this.dummyStub.bind(this);
    }

    componentDidMount() {
        
        this.ctrl.initialize();
        const ch = this.ctrl.get();
        const cid = "channels." + ch.id;
        const cAudioId = ch.id + ".audio.file.content";
        model.set(cAudioId, false);

        model.sub(cid, (val) => {
            if(val.action == "GDEL" && val.key == cid) {
                return;
            }
            const newCh = this.ctrl.get();
            this.setState({
                channel: newCh
            });
        });

        model.sub(cAudioId, (val) => {
            console.log("New audio for channel " + ch.id);
            this.sound = cAudioId;
            // this.sound = new Pizzicato.Sound(val);
        });
        
        this.setState({
            channel: ch
        });
    }

    confirmLabel(newValue) {
        this.ctrl.set("name", newValue);
        this.ctrl.update();
    }

    openFile() {
        const fileOpenId = this.state.channel.id + "-FileOpenId";
        const  file = document.getElementById(fileOpenId).files[0];
        this.setState({
            loading: true
        }, () => {
            let r = new FileReader();
            r.addEventListener("load", () => {
                
                model.set(this.state.channel.id + ".audio.file.content", r.result);
                this.confirmLabel(file.name);
                this.setState({
                    loading: false
                });
                
                
            }, false)
            r.readAsDataURL(file);
        });
    }

    deleteChannel() {
        this.setState({
            deleteChannelModalOpen: true
        });        
        
    }

    deleteChannelHandler() {
        this.ctrl.remove();
        this.setState({
            deleteChannelModalOpen: false
        });       
    }

    testSound() {
        if(this.sound && !this.state.channel.mute) {
            const sFile = model.get(this.sound);
            let s = new Pizzicato.Sound(sFile,() => {
                s.play();
            });
        }
    }

    changeVolume(e, value) {
        this.ctrl.set("volume", e.target.value);
        this.ctrl.update();
        // this.sound.volume = e.target.value / 100;
    }

    mute() {
        this.ctrl.toggleMute();
    }

    

    dummyStub(e) {
        console.log("DUMMY STUB");
    }
    
    render() {

        if(this.state.loading) {
            return (
                <div className="channel el-bg-default" id="channel">
                    Loading...
                </div>   
            )
        }

        const channelName = this.state.channel.name ? this.state.channel.name: "no name";
        const fileOpenId = this.state.channel.id + "-FileOpenId";

        return (
             <div className="channel el-bg-default" id="channel">
                 <EditableText text={this.state.channel.name} editConfirmed={this.confirmLabel} />
                <div className="buttons">
                    <div className="button-container">
                        <input type="file" id={fileOpenId} name={fileOpenId} className="file-selector" onChange={this.openFile}></input>
                        <label htmlFor={fileOpenId} className="icon-button"><img src="imgs/open.svg" /></label>
                        {/*<label htmlFor={fileOpenId}><button className="icon-button"><img src="imgs/open.svg" /></button></label>*/}
                    </div>
                    <ChannelButton clicked={this.deleteChannel} icon="imgs/cancel.svg"/>
                    <ChannelButton clicked={this.testSound} icon="imgs/play.svg" disabled={!this.sound}/>
                </div>
                <div className="mix">
                    <div className="volumecontainer">
                        <input type="range" name="volume" min="0" max="100" className="volume-slider" onChange={this.changeVolume} />
                    </div>
                    <div className="rest">
                        { this.state.channel.mute && 
                            <ChannelButton clicked={this.mute} icon="imgs/muted.svg" />
                        }
                        { !this.state.channel.mute &&
                            <ChannelButton clicked={this.mute} icon="imgs/unmuted.svg" />
                        }
                        
                        
                    </div>
                                        
                </div>
                
                <div className="buttons">
                        
                </div>

                <div className="effects">
                    Add effects!
                </div>

                <ModalConfirm open={this.state.deleteChannelModalOpen} title="Warning!" text="Delete this channel?" handleOk={this.deleteChannelHandler} handleCancel={() => { this.setState({deleteChannelModalOpen: false}); }} />

            </div>
        );
    }
};

import React from 'react';
import Pizzicato from 'pizzicato';


import ChannelButton from './ChannelButton.jsx';
import VerticalSlider from './VerticalSlider.jsx';


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
        this.toggleReverb = this.toggleReverb.bind(this);
        this.toggleDistortion = this.toggleDistortion.bind(this);

        this.dummyStub = this.dummyStub.bind(this);
    }

    componentDidMount() {
        
        this.ctrl.initialize();
        const ch = this.ctrl.get();
        const cid = "channels." + ch.id;
        const cAudioId = ch.id + ".audio.file.content";
        model.set(cAudioId, false);

        this.channelSub = model.sub(cid, (val) => {
            if(val.action == "GDEL" && val.key == cid) {
                return;
            }
            const newCh = this.ctrl.get();
            this.setState({
                channel: newCh
            });
        });

        this.audioSub = model.sub(cAudioId, (val) => {
            this.sound = cAudioId;
        });
        
        this.setState({
            channel: ch
        });
    }

    componentWillUnmount() {
        this.channelSub();
        this.audioSub();
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
                s.volume = this.state.channel.volume / 100;
                
                if(this.ctrl.effectOn('distortion')) {
                    const d = new Pizzicato.Effects.Distortion({
                        gain: 0.8
                    });
                    s.addEffect(d);
                }
                
                if(this.ctrl.effectOn('reverb')) {
                    const r = new Pizzicato.Effects.Reverb({
                        time: 1.6,
                        decay: 1.2,
                        reverse: false,
                        mix: 0.4
                    });
                    s.addEffect(r);
                }
                
                s.play();
            });
        }
    }

    changeVolume(value) {
        this.ctrl.set("volume", value);
        this.ctrl.update();
        // this.sound.volume = e.target.value / 100;
    }

    mute() {
        this.ctrl.toggleMute();
    }

    toggleReverb() {
        this.ctrl.toggleEffect("reverb");
    }

    toggleDistortion() {
        this.ctrl.toggleEffect("distortion");
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

        // const effectState = {
        //     reverb:     this.state.channel.effects && this.state.channel.effects['reverb'] ? this.state.channel.effects['reverb']: false,
        //     distortion: this.state.channel.effects && this.state.channel.effects['distortion'] ? this.state.channel.effects['distortion']: false
        // };

        const effectState = {
            reverb:     this.ctrl.effectOn('reverb'),
            distortion: this.ctrl.effectOn('distortion')
        };

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
                        {/*<input type="range" name="volume" min="0" max="100" className="volume-slider" onChange={this.changeVolume} />*/}
                        <VerticalSlider min={0} max={100} value={this.state.channel.volume} onChange={this.changeVolume} />
                        
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
                    <ChannelButton icon="imgs/distortion.svg" on={effectState.distortion} clicked={this.toggleDistortion} />
                    <ChannelButton icon="imgs/reverb.svg" on={effectState.reverb} clicked={this.toggleReverb} />
                </div>

                <ModalConfirm open={this.state.deleteChannelModalOpen} title="Warning!" text="Delete this channel?" handleOk={this.deleteChannelHandler} handleCancel={() => { this.setState({deleteChannelModalOpen: false}); }} />

            </div>
        );
    }
};

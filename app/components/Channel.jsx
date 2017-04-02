import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';

import ChannelController from 'js/control/ChannelController.js';

import EditableText from './EditableText.jsx';
import ModalConfirm from './ModalConfirm.jsx';


export default class Channel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.ctrl = new ChannelController(this.props.channelId);
        
        this.state = {
            channel: {},
            deleteChannelModalOpen: false
        };

        this.sound = new Pizzicato.Sound('sounds/kickdrum.wav');

        this.confirmLabel = this.confirmLabel.bind(this);
        this.openFile = this.openFile.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.deleteChannelHandler = this.deleteChannelHandler.bind(this);
        this.testSound = this.testSound.bind(this);
        this.changeVolume = this.changeVolume.bind(this);

        this.dummyStub = this.dummyStub.bind(this);
    }

    componentDidMount() {
        
        this.ctrl.initialize();
        const ch = this.ctrl.get();
        const cid = "channels." + ch.id;

        model.sub(cid, (val) => {
            if(val.action == "GDEL" && val.key == cid) {
                return;
            }
            const newCh = this.ctrl.get();
            this.setState({
                channel: newCh
            });
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
        console.log("open file");
       
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
        if(this.sound != false) {
            if(this.sound.playing) {
            this.sound.stop();
        }
        this.sound.play();
        }
    }

    changeVolume(e, value) {
        this.ctrl.set("volume", e.target.value);
        this.ctrl.update();
        this.sound.volume = e.target.value / 100;
    }

    dummyStub(e) {
        console.log("DUMMY STUB");
    }
    
    render() {
        const channelName = this.state.channel.name ? this.state.channel.name: "no name";
        return (
             <div className="channel el-bg-default" id="channel">
                 <EditableText text={this.state.channel.name} editConfirmed={this.confirmLabel} />
                <div className="buttons">
                    <ChannelButton clicked={this.openFile} icon="imgs/open.svg"/>
                    <ChannelButton clicked={this.deleteChannel} icon="imgs/cancel.svg"/>
                    <ChannelButton clicked={this.testSound} icon="imgs/sound.svg"/>
                </div>
                <div className="mix">
                    <div className="volumecontainer">
                        <input type="range" name="volume" min="0" max="100" className="volume-slider" onChange={this.changeVolume} />
                    </div>
                    <div className="rest">
                        <ChannelButton clicked={this.dummyStub} icon="imgs/mute.svg" />
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

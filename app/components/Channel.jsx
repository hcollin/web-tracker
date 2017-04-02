import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import Pizzicato from 'pizzicato';

import { model } from 'js/model/Model.js';
import { ChannelControl } from 'js/control/ChannelControl.js';




export default class Channel extends React.Component {
    
    constructor(props) {
        super(props);
        this.channelController = new ChannelControl(this.props.channelId);
        this.state = {
            data: this.channelController.get(),
            volume: 80,
            labelEditMode: false
        };

        

        this.sound = new Pizzicato.Sound('sounds/kickdrum.wav');

        this.editLabel = this.editLabel.bind(this);
        this.confirmLabel = this.confirmLabel.bind(this);
        this.openFile = this.openFile.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.testSound = this.testSound.bind(this);
        this.changeVolume = this.changeVolume.bind(this);

        this.volume = 100;

        this.dummyStub = this.dummyStub.bind(this);
    }

    componentDidMount() {
        const cid = "channels." + this.props.channelId;
        
        model.sub(cid, (val) => {
            console.log("Mounted", cid);
            if(val.action == "GDEL" && val.key == cid) {
                return;
            }
            this.setState({
                data:this.channelController.get()
            });
        });
    }

    editLabel(e) {
        console.log("Activate label mode"); 
        this.setState({
            labelEditMode: true
        });
    }

    confirmLabel(e) {
        this.setState({
            labelEditMode: false
        });

        const newVal = e.target.value;
        console.log(newVal, newVal.length);
        if(newVal.length > 0)
            this.channelController.set("name", newVal);
    }

    openFile() {
        console.log("open file");
       
    }

    deleteChannel() {        
        this.channelController.delete();
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

        let data = this.channelController.get();
        data.volume = e.target.value;
        this.channelController.update(data);
        this.sound.volume = data.volume / 100;
    }

    dummyStub(e) {
        console.log("DUMMY STUB");
    }
    
    render() {
        const labelClasses = this.state.labelEditMode ? "hidden" : "";
        const labelInputClasses = this.state.labelEditMode ? "" : "hidden";
        return (
             <div className="channel el-bg-default" id="channel">
                <label onClick={this.editLabel} className={labelClasses}>{this.state.data.name}</label>
                <input type="text" onBlur={this.confirmLabel} className={labelInputClasses} placeholder={this.state.data.name} maxLength="24" />
                <div className="buttons">
                    <ChannelButton clicked={this.openFile} icon="imgs/open.svg"/>
                    <ChannelButton clicked={this.deleteChannel} icon="imgs/cancel.svg"/>
                    <ChannelButton clicked={this.testSound} icon="imgs/sound.svg"/>
                </div>
                <div className="mix">
                    <div className="volumecontainer">
                        <input type="range" name="volume" min="0" max="100" className="volume-slider" value={this.state.data.volume} onChange={this.changeVolume} />
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



            </div>
        );
    }
};

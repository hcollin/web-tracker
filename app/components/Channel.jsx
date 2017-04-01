import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import { model } from 'js/model/Model.js';
import { ChannelControl } from 'js/control/ChannelControl.js';



export default class Channel extends React.Component {
    
    constructor(props) {
        super(props);
        this.channelController = new ChannelControl();
        this.state = this.channelController.get(this.props.channelId);

        this.openFile = this.openFile.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.testSound = this.testSound.bind(this);
    }

    componentDidMount() {
        const cid = "channels." + this.props.channelId;
        model.sub(cid, (val) => {
            if(val.action =="GDEL" && val.key == cid) {
                return;
            }
            this.state = this.channelController.get(this.props.channelId);
        });
    }

    openFile() {
        console.log("open file");
    }

    deleteChannel() {
        console.log("delete channel");
        this.channelController.delete(this.props.channelId);
    }

    testSound() {
        console.log("test sound");
    }

    dummyStub() {
        console.log("DUMMY STUB");
    }
    
    render() {
        return (
             <div className="channel el-bg-default" id="channel">
                <label>{this.state.name}</label>
                <div className="buttons">
                    <ChannelButton clicked={this.openFile} icon="imgs/open.svg"/>
                    <ChannelButton clicked={this.deleteChannel} icon="imgs/cancel.svg"/>
                    <ChannelButton clicked={this.testSound} icon="imgs/sound.svg"/>
                </div>
                <div className="mix">
                    <div className="volumecontainer">
                        <input type="range" name="volume" min="0" max="100" className="volume-slider" />
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

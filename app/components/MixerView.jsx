
import React from 'react';

import { model } from 'js/model/Model.js';

import MixerController from 'js/control/MixerController.js';
import ChannelController from 'js/control/ChannelController.js';

import Channel from './Channel.jsx';

export default class MixerView extends React.Component {

    constructor(props) {
        super(props);
        
        this.ctrl = new MixerController();
        this.channelController = new ChannelController();

        this.state = {
            channels: []
        };
       
        this.addNewChannel = this.addNewChannel.bind(this);

    }

    componentDidMount() {
        model.sub("channels", (val) => {
            const allChannels = this.ctrl.getChannels(true);
            if(allChannels.length != this.state.channels.length) {
                this.setState({
                    channels: allChannels
                });
            }
            
        });
        this.ctrl.initialize();
    }

    addNewChannel() {
        this.channelController.create();
    }

    render() {
        const classes = this.props.open ? "layout-view mixer-view layout-view-open" : "layout-view mixer-view";
        return (
            <div id="mixerview" className={classes}>
                <header onClick={this.props.openViewHandler} value="mixer-view">
                    <h2>Mixer</h2>
                </header>

                <div className="channels">

                    { this.state.channels.map(item => (
                        <Channel key={item} channelId={item} />
                    ) ) }
                    
                    <div className="channel new" onClick={this.addNewChannel}><p>New Channel</p></div>
                    <div className="channel empty"></div>

                    <div className="channel master el-bg-default">
                        Master
                    </div>
                </div>


            </div>
        );
    }
}
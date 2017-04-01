
import React from 'react';

import { model } from 'js/model/Model.js';
import { ChannelControl } from 'js/control/ChannelControl.js';

import Channel from './Channel.jsx';

export default class MixerView extends React.Component {

    constructor(props) {
        super(props);
        
        this.channelController = new ChannelControl();
        
        this.state = {
            channels: []
        };
        
        model.sub("channels", (val) => {
            this.setState({
                channels: this.channelController.get()
            });

        });

        this.addNewChannel = this.addNewChannel.bind(this);

    }

    addNewChannel() {
        //const channels = new ChannelControl();
        this.channelController.create();

        

    }

    render() {
        console.log("RENDER MIXER");
        const classes = this.props.open ? "layout-view mixer-view layout-view-open" : "layout-view mixer-view";
        const channels = Object.keys(this.state.channels);
        return (
            <div id="mixerview" className={classes}>
                <header onClick={this.props.openViewHandler} value="mixer-view">
                    <h2>Mixer</h2>
                </header>

                <div className="channels">

                    {channels.map((item, index) => (
                        <Channel key={index} channelId={item} />
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
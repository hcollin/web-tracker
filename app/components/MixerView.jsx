
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
       
        this.addNewChannel = this.addNewChannel.bind(this);

    }

    shouldComponentUpdate(nextProps, nextState) {
        const update = (nextState.channels.length != this.state.channels.length) || (nextProps.open != this.props.open);

        return update;
    }

    componentDidMount() {
        model.sub("channels", (val) => {
            this.setState({
                channels: Object.keys(this.channelController.get())
            });

        });
    }

    addNewChannel() {
        ChannelControl.create();
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
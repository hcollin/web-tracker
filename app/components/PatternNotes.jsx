import React from 'react';

import PatternControl from 'js/control/PatternControl.js';

import ChannelButton from './ChannelButton.jsx';

export default class PatternNotes extends React.Component {

    constructor(props) {
        super(props);
        // console.log("PatternNotes ", this.props);

        this.state = {
            channelList: []
        }

        this.changeChannel = this.changeChannel.bind(this);
        this.nextChannel = this.nextChannel.bind(this);
        this.prevChannel = this.prevChannel.bind(this);
    }

    componentDidMount() {

    }

    changeChannel() {
        console.log("change channel");
    }

    settings() {
        console.log("Settings");
    }

    nextChannel() {
        
    }

    prevChannel() {

    }

    render() {
        const channelName = this.props.notes.channelId ? this.props.notes.channelId : "no channel yet";
        return (
            <div className="pattern-notes el-bg-light">
                <header className="el-bg-default">
                    <ChannelButton clicked={this.prevChannel} icon="imgs/arrow-left.svg" />
                    <p>{channelName}</p>
                    <ChannelButton clicked={this.nextChannel} icon="imgs/arrow-right.svg" />
                </header>
                <section>
                    <button className="note large play">C4</button>
                    <button className="note">-</button>
                    <button className="note">-</button>
                    <button className="note">-</button>
                    <button className="note large play">C#4</button>
                    <button className="note">-</button>
                    <button className="note">C4</button>
                    <button className="note">-</button>
                    <button className="note large play">H8</button>
                    <button className="note">-</button>
                    <button className="note">-</button>
                    <button className="note">-</button>
                </section>
            </div>
        );
    }

}
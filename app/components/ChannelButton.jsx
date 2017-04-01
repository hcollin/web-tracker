import React from 'react';

export default class ChannelButton extends React.Component {
    render() {
        const classes = "icon-button";
        return (
            <button onClick={this.props.clicked} className={classes}><img src={this.props.icon} /></button>
        );
    }
}
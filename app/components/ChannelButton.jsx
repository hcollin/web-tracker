import React from 'react';

export default class ChannelButton extends React.Component {
    render() {
        const classes = "icon-button" + (this.props.disabled ? " inactive": "") + (this.props.on ? " on": "");
        const clickHandler = this.props.disabled ? () => {} : this.props.clicked;
        return (
            <button onClick={clickHandler} className={classes}><img src={this.props.icon} /></button>
        );
    }
}
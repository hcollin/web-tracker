import React from 'react';

export default class ChannelButton extends React.Component {
    render() {
        const classes = this.props.disabled ? " icon-button inactive": "icon-button";
        const clickHandler = this.props.disabled ? () => {} : this.props.clicked;
        return (
            <button onClick={clickHandler} className={classes}><img src={this.props.icon} /></button>
        );
    }
}
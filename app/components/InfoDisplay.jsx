import React from 'react';

export default class InfoDisplay extends React.Component {
    render() {
        return (
            <div className="info-display">{this.props.value}</div>
        )
    }
}
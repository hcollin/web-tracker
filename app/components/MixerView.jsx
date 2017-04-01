
import React from 'react';

export default class MixerView extends React.Component {
    render() {
        const classes = this.props.open ? "layout-view mixer-view layout-view-open" : "layout-view mixer-view";
        return (
            <div id="mixerview" className={classes}>
                <header onClick={this.props.openViewHandler} value="mixer-view">
                    <h2>Mixer</h2>
                </header>

                sdfsdf
            </div>
        );
    }
}
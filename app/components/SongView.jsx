
import React from 'react';

export default class SongView extends React.Component {
    render() {
        const classes = this.props.open ? "layout-view song-view layout-view-open" : "layout-view song-view";
        return (
            <div id="songview" className={classes}>
                <header onClick={this.props.openViewHandler} value="song-view">
                    <h2>Song</h2>
                </header>

                sdfsdfsdf
            </div>
        );
    }
}
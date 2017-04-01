
import React from 'react';

export default class PatternView extends React.Component {
    render() {
        const classes = this.props.open ? "layout-view pattern-view layout-view-open" : "layout-view pattern-view";
        return (
            <div id="patternview" className={classes}>
                <header onClick={this.props.openViewHandler} value="patterns-view">
                    <h2>Patterns</h2>
                </header>

                sdfsdfsdf
            </div>
        );
    }
}
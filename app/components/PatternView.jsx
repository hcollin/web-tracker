
import React from 'react';
import ChannelButton from './ChannelButton.jsx';
import InfoDisplay from './InfoDisplay.jsx';

import { model } from 'js/model/Model.js';
import PatternControl from 'js/control/PatternControl.js';

export default class PatternView extends React.Component {

    constructor(props) {
        super(props);

        this.patternController = new PatternControl();

        this.state = {
            currentPattern: 0,
            data: {}
        };

        this.newPattern = this.newPattern.bind(this);
        this.nextPattern = this.nextPattern.bind(this);
        this.prevPattern = this.prevPattern.bind(this);

    }

    ComponentDidMount() {

    }

    newPattern() {
        console.log("New Pattern");
        PatternControl.create();
    }

    nextPattern() {
        const newId = this.state.currentPattern + 1;
        const patId = "pattern-" + newId;
        let pattern = this.patternController.get(patId);
        console.log("Pattern", pattern);
        if(pattern === undefined) {
            pattern = PatternControl.create(newId);
            console.log("Crate Pattern", pattern);
        }
        this.setState({
            currentPattern: newId,
            data: pattern
        });
    }

    prevPattern() {
        if(this.state.currentPattern <= 0) {
            return;
        }
        this.setState( {
            currentPattern: this.state.currentPattern - 1
        });
    }

    stub() {

    }


    render() {
        const classes = this.props.open ? "layout-view pattern-view layout-view-open" : "layout-view pattern-view";
        return (
            <div id="patternview" className={classes}>
                <header onClick={this.props.openViewHandler} value="pattern-view">
                    <h2>Patterns</h2>
                </header>
                <div className="pattern-editor">
                    <div className="el-bg-light pattern-toolbar">
                        <ChannelButton clicked={this.newPattern} icon="imgs/newsong.svg" />
                        <span className="divider" />
                        <ChannelButton clicked={this.prevPattern} icon="imgs/arrow-left.svg" />
                        <InfoDisplay value={this.state.currentPattern} />
                        <ChannelButton clicked={this.nextPattern} icon="imgs/arrow-right.svg" />
                        <span className="divider" />


                    </div>

                    <div className="pattern-notes">
                        <div className="pattern-channel">

                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}
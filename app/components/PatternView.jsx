
import React from 'react';
import ChannelButton from './ChannelButton.jsx';

import InfoDisplay from './InfoDisplay.jsx';
import EditableText from './EditableText.jsx';
import PatternNotes from './PatternNotes.jsx';

import { model } from 'js/model/Model.js';
import PatternControl from 'js/control/PatternControl.js';

export default class PatternView extends React.Component {

    constructor(props) {
        super(props);

        this.ctrl = new PatternControl();

        this.state = {
            patternList: [],
            index: 0,
            pattern: {}
        };

        this.dummy = "DUMMY STUB"

        this.newPattern = this.newPattern.bind(this);
        this.nextPattern = this.nextPattern.bind(this);
        this.prevPattern = this.prevPattern.bind(this);
        this.changeName = this.changeName.bind(this);
        this.loadPattern = this.loadPattern.bind(this);

    }

    componentDidMount() {
        model.sub("patterns", () => {
            // console.log("Update patternlist if necessary\n", model.get(), "\n",this.ctrl.getAllKeys());

            this.setState({
                patternList: this.ctrl.getAllKeys()
            }, this.loadPattern);
            
        });
        this.ctrl.initialize();
    }

    newPattern() {
         this.ctrl.create();
    }

    loadPattern() {
        
        const pattern = this.ctrl.get(this.state.patternList[this.state.index]);
        this.setState({
            pattern: pattern
        });
    }

    nextPattern() {
        const newIndex = this.state.index + 1;
        this.setState({
            index: newIndex
        }, this.loadPattern);
    }

    prevPattern() {
        if(this.state.index > 0) {
            this.setState({
                index: this.state.index - 1
            }, this.loadPattern);
        }
    }

    changeName(newName) {
        this.ctrl.set("name", newName);
        this.ctrl.update();
    }

    stub(e) {
        console.log("PatternView.stub() clicked by ", e.target);
    }


    render() {
        const classes = this.props.open ? "layout-view pattern-view layout-view-open" : "layout-view pattern-view";
        
        const channels = this.state.pattern.channels !== undefined ? this.state.pattern.channels : [];
        // console.log("channels", channels);
        return (
            <div id="patternview" className={classes}>
                <header onClick={this.props.openViewHandler} value="pattern-view">
                    <h2>Patterns</h2>
                </header>
                <div className="pattern-editor">
                    <div className="el-bg-light pattern-toolbar">
                        <ChannelButton clicked={this.prevPattern} disabled={this.state.index == 0} icon="imgs/arrow-left.svg" />
                        <EditableText text={this.state.pattern.name} editConfirmed={this.changeName} />
                        <ChannelButton clicked={this.nextPattern} icon="imgs/arrow-right.svg" disabled={this.state.index >= (this.state.patternList.length -1)} />
                        <ChannelButton clicked={this.newPattern} icon="imgs/plus.svg" />
                        <span className="divider" />
                        <ChannelButton clicked={this.stub} icon="imgs/delete.svg" />
                        <span className="divider" />
                    </div>

                    <div className="pattern-notes-container">
                        { channels.map((item, index) => (
                            <PatternNotes key={index} notes={item} beats={this.state.pattern.beats} />
                        ))}
                        
                    </div>
                </div>
                
            </div>
        );
    }
}
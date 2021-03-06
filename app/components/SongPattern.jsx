import React from 'react';

import SongController from 'js/control/SongController.js';

import ChannelButton from './ChannelButton.jsx';
import DropDown from './DropDown.jsx';

export default class SongPattern extends React.Component {

    constructor(props) {
        super(props);

        this.ctrl = new SongController();

        this.stub = this.stub.bind(this);
        this.patternChanged = this.patternChanged.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.remove = this.remove.bind(this);
    }

    patternChanged(e) {
        const songPattern = Object.assign({}, this.props.item, { patternId: e.target.value});
        this.ctrl.changePattern(songPattern, this.props.index);
    }

    moveUp() {
        this.ctrl.patternUp(this.props.index);
    }

    moveDown() {
        this.ctrl.patternDown(this.props.index);
    }

    remove() {
        this.ctrl.removePattern(this.props.index);
    }

    stub() {
        console.log("SHTUB");
    }

    render() {
        const songPatternId = "dropdown-" +this.props.id;
        return (
            <div className="song-pattern">
                <h2>{this.props.index}</h2>
                <DropDown id={songPatternId} list={this.props.patternList} selectedvalue={this.props.item.patternId} textKey="name" idKey="id" onSelect={this.patternChanged} />

                {/*<select value={this.props.patternId} onChange={this.patternChanged}>
                    {this.props.patternList.map((item, index) => (
                          <option value={item.id} key={index} >{item.name}</option>
                        )
                    )}
                </select>*/}
                <ChannelButton clicked={this.moveUp} icon="imgs/arrow-up.svg" />
                <ChannelButton clicked={this.moveDown} icon="imgs/arrow-down.svg" />
                <span className="divider" />
                <ChannelButton clicked={this.remove} icon="imgs/delete.svg" />
            </div>
        );
    }

}
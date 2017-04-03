import React from 'react';


export default class Note extends React.Component {

    constructor(props) {
        super(props);

        this.togglePlay = this.togglePlay.bind(this);
    }

    togglePlay() {
        console.log("Note:", this.props.note);
        const note = this.props.note;

        if(Object.keys(note).length == 0) {
            this.props.action(this.props.index, "PLAY");
            return;
        }

        if(note.start) {
            this.props.action(this.props.index, "STOP");
            return;
        }

        if(note.stop) {
            this.props.action(this.props.index, "EMPTY");
            return;
        }
        

        // if(this.props.note.start == false && this.props.note.stop == false) {
        //     this.props.action(this.props.index, "PLAY");
        //     return;
        // }

        // if(this.props.note.start == true && this.props.note.stop == false) {
        //     this.props.action(this.props.index, "STOP");
        //     return;
        // }

        // if(this.props.note.start == false && this.props.note.stop == true) {
        //     this.props.action(this.props.index, "EMPTY");
        //     return;
        // }
    }
    

    render() {
        const noteText = this.props.note.note ? this.props.note.note + this.props.note.octave : "-";
        const classes = "note" + (this.props.note.start ? " play" : "") + (this.props.note.stop ? " stop" : "") + (this.props.large ? " large" : "");
        // console.log("Note", this.props.note);
        return (
            <button className={classes} onClick={this.togglePlay}>{noteText}</button>
        );
    }
}
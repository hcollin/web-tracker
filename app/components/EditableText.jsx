import React from 'react';

import ChannelButton from './ChannelButton.jsx';

export default class EditableText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editmode: false
        };

        this.tempvalue = false;

        this.originalText = this.props.text;

        this.showInput = this.showInput.bind(this);
        this.confirmInput = this.confirmInput.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
        this.cancelInput = this.cancelInput.bind(this);
        this.checkEsc = this.checkEsc.bind(this);
        this.storeValue = this.storeValue.bind(this);
    }

    componentDidMount() {

    }

    storeValue(e) {
        this.tempvalue = e.target.value;
    }

    showInput() {
        this.setState({
            editmode: true
        });
    }

    cancelInput() {
        this.setState({
            editmode: false
        });
    }

    checkEsc(e) {
        if(e.key == "Escape") {
            this.cancelInput();
        }
    }

    checkEnter(e) {
        if(e.key == "Enter") {
            this.confirmInput(e);
        }
        
    }

    confirmInput(e) {
        const newValue = this.tempvalue;
        this.setState({
            editmode: false
        });
        
        if(newValue && newValue.trim().length > 0) {
            this.props.editConfirmed(newValue);
        }
    }

    render() {
        const labelClasses = this.state.editmode ? "hidden": "";
        const inputClasses = this.state.editmode ? "": "hidden";
        const showButtons = this.props.showButtons == true ? true : false;
        return (
            <div className="editable-text">
                <label className={labelClasses} onClick={this.showInput}>{this.props.text}</label>
                <input className={inputClasses} type="text" placeholder={this.props.text} onKeyPress={this.checkEnter} onKeyUp={this.checkEsc} onChange={this.storeValue} />
                {showButtons === true &&  this.state.editmode === false && 
                    <ChannelButton icon="imgs/edit.svg" clicked={this.showInput} />
                }
                {showButtons === true && this.state.editmode === true &&
                    <ChannelButton icon="imgs/cancel.svg" clicked={this.cancelInput} />
                }
                {showButtons === true && this.state.editmode === true &&
                    <ChannelButton icon="imgs/save.svg" clicked={this.confirmInput} />
                }
                
                

            </div>
        );
    }
}
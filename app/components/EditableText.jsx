import React from 'react';

export default class EditableText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editmode: false
        };

        this.showInput = this.showInput.bind(this);
        this.confirmInput = this.confirmInput.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
    }

    componentDidMount() {

    }

    showInput() {
        this.setState({
            editmode: true
        });
    }

    checkEnter(e) {
        if(e.key == "Enter") {
            this.confirmInput(e);
        }
    }

    confirmInput(e) {
        const newValue = e.target.value;
        this.setState({
            editmode: false
        });

        this.props.editConfirmed(newValue);


    }

    render() {
        const labelClasses = this.state.editmode ? "hidden": "";
        const inputClasses = this.state.editmode ? "": "hidden";

        return (
            <div className="editable-text">
                <label className={labelClasses} onClick={this.showInput}>{this.props.text}</label>
                <input className={inputClasses} type="text" placeholder={this.props.text} onBlur={this.confirmInput} onKeyPress={this.checkEnter} />
            </div>
        );
    }
}
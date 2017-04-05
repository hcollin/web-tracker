import React from 'react';

export default class DropDown extends React.Component {


    render() {
        const id = this.props.id ? this.props.id : "dropdown";
        return(
            <select value={this.props.selectedvalue} onChange={this.props.onSelect} id={id}>
                {this.props.list.map((item) => (
                    <option key={item[this.props.idKey]} value={item[this.props.idKey]}>{item[this.props.textKey]}</option>
                ))}
            </select>

        )
    }

}
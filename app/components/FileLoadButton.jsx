import React from 'react';

export default class FileLoadButton extends React.Component {

    constructor(props) {
        super(props);

        this.openFile = this.openFile.bind(this);
    }

    openFile() {
        const  file = document.getElementById(this.props.id).files[0];
        
        let r = new FileReader();
        r.addEventListener("load", () => {
            console.log("Fileloaded: ", file, r);
            
            const fileObject = {
                name: file.name,
                size: file.size,
                content: r.result
            };
            this.props.fileLoaded(fileObject);

        }, false);

        switch(this.props.datatype) {
            case "DataURL":
                r.readAsDataURL(file);
                break;         
            case "arrayBuffer":
                r.readAsArrayBuffer(file);
                break;
            case "binaryString":
                r.readAsBinaryString(file);
                break;
            case "text":
            default:
                r.readAsText(file);
                break;

        }
    }

    render() {
        const acceptedFiles = this.props.mimes ? this.props.mimes : ".";
        return (
            <div className="button-container">
                <input type="file" id={this.props.id} name={this.props.id} className="file-selector" onChange={this.openFile} accept={acceptedFiles} ></input>
                <label htmlFor={this.props.id} className="icon-button"><img src="imgs/open.svg" /></label>
            </div>
        )
    }

}
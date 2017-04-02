import React from 'react';

export default class ModalConfirm extends React.Component {

    render() {
        if(!this.props.open) {
            return null;
        }
        const title = this.props.title ? this.props.title : "Notice!";
        return (
            <div className="modal-container">
                <div className="modal">
                    <header>
                        {title}
                    </header>

                    <article>    
                        {this.props.text}
                    </article>

                    <footer>
                        <button className="modal-button cancel" onClick={this.props.handleCancel}>Cancel</button>
                        <button className="modal-button ok" onClick={this.props.handleOk}>Ok</button>
                    </footer>
                </div>
            </div>
        )
    }
}
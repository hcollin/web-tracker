import React from 'react';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ms: 0
        };

        this.looper = false;

    }

    componentWillReceiveProps(np){

        const waiter = np.mswait ? np.mswait : 100;
        if(np.status === "PLAY" && this.props.status === "STOP") {
            this.setState({
                ms: 0
            });
            this.looper = setInterval(() => {
                this.setState(( ps ,pr ) => ({
                   ms: ps.ms + waiter
                }));
            }, waiter);
        }
        if( np.status === "STOP" && this.props.status === "PLAY"){
            this.setState({
                ms: 0
            });
            if(this.looper) {
                clearInterval(this.looper);
            }
        }

    }

    render() {

        const mins = Math.floor(this.state.ms / 60000);
        const secs = Math.floor((this.state.ms - (mins * 60000))/1000);
        const mss = Math.round(this.state.ms - (mins*60000) - (secs*1000));
        return (
            <div className="timer-component">
                {mins}:{secs < 10 ? "0" + secs : secs}.{ ("000" + mss).slice(-3) }
            </div>
        )
    }
}
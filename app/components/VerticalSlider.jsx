import React from 'react';


export default class VerticalSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dragOn: false,
            prevY: 0,
            bottomPerc: 80,
            trackDimensions: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);

        this.calcNewPosition = this.calcNewPosition.bind(this);
    }



    componentWillReceiveProps(nextProps) {

    }
    

    handleMouseDown(e) {
        this.setState({
            dragOn: true,
            prevY: e.clientY,
            trackDimensions: this.sliderTrackElem.getBoundingClientRect()
        });
    }

    handleMouseMove(e) {
        if(this.state.dragOn) {
            e.persist();
            const diff = this.state.prevY - e.clientY;
            this.calcNewPosition(diff, e.clientY);
        }
    }

    handleMouseUp(e) {
        // console.log("Mouse Up", e);
        this.setState({
            dragOn: false,
            startY: 0
        });
    }

    handleMouseWheel(e) {
        e.persist();
        this.setState({
            trackDimensions: this.sliderTrackElem.getBoundingClientRect()
            
        }, () => {
            const onePerc = (this.state.trackDimensions.height / 100)*5;
            if(e.deltaY < 0) {
                this.calcNewPosition(onePerc, this.state.prevY + onePerc);
            } else {
                this.calcNewPosition((onePerc * -1), this.state.prevY - onePerc);
            }
        });
        
        
    }

    calcNewPosition(diff, currentY) {
        const absDiff = Math.abs(diff);
        const pixInPrc = 100 / (this.state.trackDimensions.height);
        const newDiff = this.state.bottomPerc + (pixInPrc * diff);
        let roundedDiff = (Math.round(newDiff*100))/100;
        if(roundedDiff < 0) {
            roundedDiff = 0;
        }

        if(roundedDiff > 100) {
            roundedDiff = 100;
        }
        this.setState({
            bottomPerc: roundedDiff,
            prevY: currentY
        }, () => {
            const newValue = ((this.props.max - this.props.min ) / 100) * roundedDiff;
            this.props.onChange(newValue);
        });
    }


    

    render() {
        
        const bottomPercStr = this.state.bottomPerc + "%";
        const valuePerc = Math.round(this.state.bottomPerc);
        return (
            <div className="verticalSlider">
                <div className="sliderTrack" ref={(div) => { this.sliderTrackElem = div; }} onWheel={this.handleMouseWheel}>
                    <div className="sliderKnob" 
                         onMouseDown={this.handleMouseDown} 
                         onMouseUp={this.handleMouseUp} 
                         onMouseLeave={this.handleMouseUp} 
                         onMouseMove={this.handleMouseMove} 
                         style={{bottom: bottomPercStr}}
                         ref={(div) => { this.sliderKnobElem = div; }}
                    >
                        {valuePerc}
                    </div>
                </div>
            </div>
        )
    }
}

import React from 'react';

import MainHeader from './MainHeader.jsx';
import SongView from './SongView.jsx';
import PatternView from './PatternView.jsx';
import MixerView from './MixerView.jsx';


import { model } from 'js/model/Model.js';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      openview: model.get("view.main.open")
    };

    this.changeOpenView = this.changeOpenView.bind(this);
  }

  changeOpenView(e) {
    const newView = e.target.attributes.value.value;
    this.setState({
      openview: newView
    });
    model.set("view.main.open", newView);
  }

  render() {
    console.log("re-render App");
    return (
      <div id="content" className="layout">
        
        <MainHeader />
        
        <div className="layout-main">
           <SongView openViewHandler={this.changeOpenView} open={this.state.openview == "song-view"}/>
           <PatternView openViewHandler={this.changeOpenView} open={this.state.openview == "pattern-view"}/>
           <MixerView openViewHandler={this.changeOpenView} open={this.state.openview == "mixer-view"}/>
        </div>

        <div className="layout-footer el-bg-default">
          &copy; Henrik Collin 2017
        </div>
      </div>
    );
  }
}
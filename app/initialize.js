import React from 'react';
import ReactDOM from 'react-dom';

import { model } from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

import ChannelController from 'js/control/ChannelController.js';
import MixerController from 'js/control/MixerController.js';
import PatternController from 'js/control/PatternController.js';
import TrackController from 'js/control/TrackController.js';
import SongController from 'js/control/SongController.js';

import App from 'components/App';

document.addEventListener('DOMContentLoaded', () => {
  
  model.DEBUG = true;
  model.set("view.main.open", "song-view");

  
  player.stop();

  ReactDOM.render(<App />, document.querySelector('#app'));
  
  
  // let cc = new ChannelController();
  // cc.create();

  // Init model with Controllers
  // These do not work yet properly. To save and load stuff, this needs to be refactored to working condition.
  let sc = new SongController();
  sc.initialize();
  
  let mc = new MixerController();
  mc.initialize();
  mc.createChannel("AUDIO");

  let pc = new PatternController();
  pc.initialize();
  pc.create();

  const pt = pc.get();
  console.log("pattern", pc);
  sc.addPattern(pt.pattern.id);



  
});

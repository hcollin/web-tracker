import ReactDOM from 'react-dom';
import React from 'react';

import { model } from 'js/model/Model.js';
import { player } from 'js/control/Player.js';

import { SongControl } from 'js/control/SongControl.js';
import ChannelController from 'js/control/ChannelController.js';


import App from 'components/App';

document.addEventListener('DOMContentLoaded', () => {
  

  model.DEBUG = true;
  model.set("view.main.open", "mixer-view");
  player.stop();

  ReactDOM.render(<App />, document.querySelector('#app'));
  
  SongControl.create();
  let cc = new ChannelController();
  cc.create();
  
});

import ReactDOM from 'react-dom';
import React from 'react';

import { model } from 'js/model/Model.js';
import { SongControl } from 'js/control/SongControl.js';


import App from 'components/App';

document.addEventListener('DOMContentLoaded', () => {
  
  model.DEBUG = true;
  model.set("view.main.open", "mixer-view");
  
  ReactDOM.render(<App />, document.querySelector('#app'));
  SongControl.create();
});

import { model } from 'js/model/Model.js';
import { SongControl } from 'js/control/SongControl.js';
import { PatternControl } from 'js/control/PatternControl.js';

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  console.log('Initialized app');

  model.DEBUG = true;

  const songCtrl = new SongControl();
  const patternCtrl = new PatternControl();

  songCtrl.create();

  function renderPatterns() {
    let pats = document.getElementById("patterns");
    pats.innerHTML = "";
    const patterns = patternCtrl.getAll();
    for(var i = 0; i < patterns.length ; i++) {
        const pat = patterns[i];

        let el = document.createElement("div");
        el.classList.add("pattern");
        el.innerHTML = "pattern " + pat.id;
        el.id = pat.id;
        pats.appendChild(el);
        el.addEventListener("click", (e) => {
          patternCtrl.remove(e.target.id);
        });
    }
  }

  model.sub("patterns", () => {
    renderPatterns();
  });

  model.sub("DEBUGMODEL", (data, rev) => {
    console.log("MODEL " + rev + ": ", data);
  });

  document.getElementById("addPattern").addEventListener("click", () => {
      let d = patternCtrl.create();
      renderPatterns();
  });

  



});

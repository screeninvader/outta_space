import _ from 'underscore';
import {bindEvent, helpers} from './utils';
import api from './api';

class Controls {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.actions =  [
      'previous', 'rewind',  'pause', 'forward', 'next'
    ];
    api.subscribe("playerTimePos",this.timePosChanged);
  }

  template(state) {
    state = state || {};
    state.actions = this.actions;
    return _.template(`
      <% _.each(actions, function(action) { %>
        <a href="#" id="<%= action %>" class="icon action <%= action %>" title="r<%= action %>"></a>
      <% }); %>
      <input id="volume" type="range" min="0" max="100" value="<%= sound.volume %>"></input>
      <div id="progress">
        <progress id="progress-bar" min="0" max="1000"></progress><span id="progress-text"></span>
      </div>
    `)(_.extend(state, helpers));
  }

  timePosChanged(msg) {
    var currentAndTotalTime = JSON.parse(msg);
    var tokens = currentAndTotalTime[0].split(":");
    var h = parseInt(tokens[0],10);
    var m = parseInt(tokens[1],10);
    var s = parseInt(tokens[2],10);
    var currentTimeSeconds  = (h * 60 * 60) + (m * 60) + s;

    tokens = currentAndTotalTime[1].split(":");
    h = parseInt(tokens[0],10);
    m = parseInt(tokens[1],10);
    s = parseInt(tokens[2],10);

    var totalTimeSeconds  = (h * 60 * 60) + (m * 60) + s;

    var progressElem = document.getElementById("progress-bar");
    progressElem.max = totalTimeSeconds;
    progressElem.value = currentTimeSeconds;
    var progressHtml = "&nbsp;" + currentAndTotalTime[0] + "/" + currentAndTotalTime[1];
    document.getElementById("progress-text").innerHTML= progressHtml;
  } 

  render(state) {
    var playIndex  = _.indexOf(this.actions, 'play')
      , pauseIndex =  _.indexOf(this.actions, 'pause');

    var index = playIndex == -1 ? pauseIndex : playIndex;
    if (state.player.paused == true ) {
      this.actions[index] = 'play';
    } else {
      this.actions[index] = 'pause';
    }

    var temp = this.template(state);
    this.el.innerHTML = temp;

    if(state.player.paused == true) {
      this.el.querySelector('#play').classList.add("blink");
    }

    bindEvent(this, 'a.action', 'click', this.clickHandler);
    bindEvent(this, '#volume', 'change', this.volumeHandler);
    bindEvent(this, '#progress-bar', 'click', this.progressHandler);
  }

  clickHandler(ev) {
    api.player[ev.target.id]();
  }

  volumeHandler(ev) {
    api.setVolume(ev.target.value);
  }

  progressHandler(ev) {
    console.log(ev.target.x);
    var bound = ev.target.getBoundingClientRect();
    var x = ev.pageX - bound.left; // or e.offsetX (less support, though)
    var clickedValue = parseFloat(x * ev.target.max / bound.width);
    api.player.seek(clickedValue);
  }
}

export default Controls;

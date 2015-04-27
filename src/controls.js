import _ from 'underscore';
import {bindEvent, helpers} from './utils';
import api from './api';

class Controls {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.actions = [
      'previous', 'rewind',  'pause', 'forward', 'next'
    ];
  }

  template(state) {
    state = state || {};
    state.actions = this.actions;
    return _.template(`
      <% _.each(actions, function(action) { %>
        <a href="#" id="<%= action %>" class="icon action <%= action %>" title="<%= action %>"></a>
      <% }); %>
      <input id="volume" type="range" min="0" max="100" value="<%= sound.volume %>" />
    `)(_.extend(state, helpers));
  }

  render(state) {
    var playIndex  = _.indexOf(this.actions, 'play')
      , pauseIndex =  _.indexOf(this.actions, 'pause');

    var index = playIndex == -1 ? pauseIndex : playIndex;
    if (state.player.paused == "true" ) {
      this.actions[index] = 'play';
    } else {
      this.actions[index] = 'pause';
    }

    var temp = this.template(state);
    this.el.innerHTML = temp;

    if(state.player.paused == "true") {
      this.el.querySelector('#play').classList.add("blink");
    }

    bindEvent(this, 'a.action', 'click', this.clickHandler);
    bindEvent(this, '#volume', 'change', this.volumeHandler);
  }

  clickHandler(ev) {
    api.player[ev.target.id]();
  }

  volumeHandler(ev) {
    api.setVolume(ev.target.value);
  }
}

export default Controls;

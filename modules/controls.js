import _ from 'underscore';
import {bindEvent, helpers} from '../src/utils';
import api from '../src/api';

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
    var temp = this.template(state);
    this.el.innerHTML = temp;
    bindEvent(this, 'a.action', 'click', this.clickHandler);
    bindEvent(this, '#volume', 'change', this.volumeHandler);
  }

  clickHandler(ev) {
    var playIndex  = _.indexOf(this.actions, 'play')
      , pauseIndex =  _.indexOf(this.actions, 'pause')
    if ( playIndex > -1 ) {
      this.actions[playIndex] = 'pause';
    } else if ( pauseIndex > -1 ) {
      this.actions[pauseIndex] = 'play';
    }
    api.player[ev.target.id]();
  }

  volumeHandler(ev) {
    api.setVolume(ev.target.value);
  }
}

export default Controls;

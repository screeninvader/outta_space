import _ from 'underscore';
import {bindEvent, helpers} from '../src/utils';
import api from '../src/api';

class Controls {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.actions = [
      'previous', 'play', 'pause', 'next'
    ];
  }

  template(state) {
    state = state || {};
    state.actions = this.actions;
    return _.template(`
      <% _.each(actions, function(action) { %>
        <a href="#" id="<%= action %>" class="icon action"><%= action %></a>
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
    api.player[ev.target.id]();
  }

  volumeHandler(ev) {
    api.setVolume(ev.target.value);
  }
}

export default Controls;

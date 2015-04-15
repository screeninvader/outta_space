import _ from 'underscore';
import {bindEvent, helpers} from './utils';
import api from './api';

class Browser {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.actions = [
      'close', 'zoomIn',  'zoomOut', 'pageDown', 'pageUp'
    ];
  }

  template(state) {
    state = state || {};
    state.actions = this.actions;
    console.log(state);
    return _.template(`
      <span>Browser Control</span>
      <% _.each(actions, function(action) { %>
        <a href="#" id="<%= action %>" class="icon action <%= action %>" title="<%= action %>"></a>
      <% }); %>
    `)(_.extend(state, helpers));
  }

  render(state) {
    if(state.browser.active == "true") {
      var temp = this.template(state);
      this.el.innerHTML = temp;
      this.el.style.display = "";
      bindEvent(this, 'a.action', 'click', this.clickHandler);
    } else
      this.el.style.display = "none";
  }

  clickHandler(ev) {
    api.browser[ev.target.id]();
  }
}

export default Browser;

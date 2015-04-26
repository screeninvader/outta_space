import _ from 'underscore';
import {bindEvent, helpers} from './utils';
import api from './api';

class Shairport {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  template(state) {
    state = state || {};

    return _.template(`
      <span id=".status"></span>
    `)(_.extend(state, helpers));
  }

  render(state) {
    var temp = this.template(state);
    this.el.innerHTML = temp;
    var stat = this.el.querySelector('span');
    if(state.shairport.active == 'true') {
      stat.innerHTML = "Deactivate Shairport"
      stat.classList.add("blink")
      bindEvent(this, 'span', 'click', function(ev) {
        api.shairport["stop"]();
      });
    } else {
      stat.innerHTML = "Activate Shairport"
      stat.classList.remove("blink")
      bindEvent(this, 'span', 'click', function(ev) {
        api.shairport["start"]();
      });
    }
  }
}

export default Shairport;

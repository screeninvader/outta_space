import _ from 'underscore';
import {bindEvent, helpers} from './utils';
import api from './api';

class Modes {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  template(state) {
    state = state || {};

    return _.template(`
      <span class="shairport">Shairport</span>
    `)(_.extend(state, helpers));
  }

  render(state) {
    var temp = this.template(state);
    this.el.innerHTML = temp;
    var stat = this.el.querySelector('.shairport');
    if(state.shairport.active == 'true') {
      stat.classList.add("blink")
      bindEvent(this, 'span', 'click', function(ev) {
        api.shairport["stop"]();
      });
    } else {
      stat.classList.remove("blink")
      bindEvent(this, 'span', 'click', function(ev) {
        api.shairport["start"]();
      });
    }
  }
}

export default Modes;

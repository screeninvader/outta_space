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
      <a class="shairport">Shairport</a>
    `)(_.extend(state, helpers));
  }

  render(state) {
    var temp = this.template(state);
    this.el.innerHTML = temp;
    var stat = this.el.querySelector('.shairport');
    if(state.shairport.active == 'true') {
      stat.classList.add("blink")
      bindEvent(this, '.shairport', 'click', function(ev) {
        api.shairport["stop"]();
      });
    } else {
      stat.classList.remove("blink")
      bindEvent(this, '.shairport', 'click', function(ev) {
        api.shairport["start"]();
      });
    }
  }
}

export default Modes;

import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Controls {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.template = loadTemplate('#template-controls');
    this.actions = [
      'previous', 'rewind', 'pause', 'forward', 'next'
    ];
  }
  render(state) {
    this.el.innerHTML = this.template({
      actions: this.actions
    , volume: state.sound.volume
    });
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

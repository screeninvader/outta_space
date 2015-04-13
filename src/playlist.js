import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Playlist {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.template = loadTemplate('#template-playlist');
  }
  render(state) {
    this.el.innerHTML = this.template(state.playlist);
    bindEvent(this, '.item', 'click', this.clickHandler);
    bindEvent(this, '.remove', 'click', this.removeHandler);
  }
  clickHandler(ev) {
    // ev.target is the <a> element, parentNode.parentNode the <li> element.
    api.player.jump(ev.target.parentNode.parentNode.getAttribute('data-id'));
  }
  removeHandler(ev) {
    api.playlist.remove(ev.target.parentNode.parentNode.getAttribute('data-id'));
  }
}

export default Playlist;

import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Playlist {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.template = loadTemplate('#template-playlist');
    }
    render(state) {
        bindEvent(this, 'click', this.clickHandler);
        this.el.innerHTML = this.template(state.playlist);
    }
    clickHandler(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.player.jump(ev.target.parentNode.getAttribute('data-id'));
    }
}

export default Playlist;

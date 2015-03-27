import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Playlist {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.template = loadTemplate('#template-playlist');
        bindEvent(this, 'click', this.clickHandler);
    }
    render(state) {
        this.el.innerHTML = this.template(state.playlist);
    }
    clickHandler(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.jump(ev.target.parentNode.getAttribute('data-id'));
    }
}

export default Playlist;

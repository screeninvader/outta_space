import {loadTemplate, bindEvent} from './utils';
import api from './api';

var Playlist = function(selector) {
    this.el = document.querySelector(selector);
    this.template = loadTemplate('#template-playlist');
    bindEvent(this, 'click', this.clickHandler);
};

Playlist.prototype = {
    render: function(state) {
        this.el.innerHTML = this.template(state.playlist);
    },
    clickHandler: function(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.jump(ev.target.parentNode.getAttribute('data-id'));
    }
};

export default Playlist;

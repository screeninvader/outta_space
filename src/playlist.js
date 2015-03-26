import {loadTemplate} from './utils';
import api from './api';

var Playlist = function(selector) {
    this.el = document.querySelector(selector);
    this.template = loadTemplate('#template-playlist');
    this.el.addEventListener('click', this.itemClickHandler);
};

Playlist.prototype = {
    render: function(state) {
        this.el.innerHTML = this.template(state.playlist);
    },
    itemClickHandler: function(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.jump(ev.target.parentNode.getAttribute('data-id'));
    }
};

export default Playlist;

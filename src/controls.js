import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Controls {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.template = loadTemplate('#template-controls');
        this.actions = [
            'previous', 'play', 'pause', 'next'];
    }
    render(state) {
        this.el.innerHTML = this.template({actions: this.actions});
        bindEvent(this, 'a.action', 'click', this.clickHandler);
    }
    clickHandler (ev) {
        api.player[ev.target.id]();
    }
}

export default Controls;

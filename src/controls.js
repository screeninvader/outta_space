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
        bindEvent(this, 'click', this.clickHandler);
    }
    clickHandler (ev) {
        // only handle clicks on children, not on this.el itself.
        if (ev.target === ev.currentTarget)
            return;
        api.player[ev.target.id]();
    }
}

export default Controls;

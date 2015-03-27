import {loadTemplate, bindEvent} from './utils';
import api from './api';

class Controls {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.template = loadTemplate('#template-controls');
        this.actions = [
            'previous', 'play', 'pause', 'next',
            'volume-increase', 'volume-decrease'];
        bindEvent(this, 'click', this.clickHandler);
    }
    render(state) {
        this.el.innerHTML = this.template({actions: this.actions});
    }
    clickHandler (ev) {
        // only handle clicks on children, not on this.el itself.
        if (ev.target === ev.currentTarget)
            return;
        api[ev.target.id]();
    }
}

export default Controls;

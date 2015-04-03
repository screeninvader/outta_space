import {loadTemplate, bindEvent} from './utils';
import api from './api';

class PostUrl {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.template = loadTemplate('#template-post-url');
    }
    render(state) {
        this.el.innerHTML = this.template();
        bindEvent(this, 'form', 'submit', this.submitHandler);
    }
    submitHandler(ev) {
        api.showUrl(ev.target.querySelector('input[type=text]').value);
    }
}

export default PostUrl;

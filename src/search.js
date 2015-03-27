import _ from 'underscore';
import {loadTemplate, fetchJSON, bindEvents} from './utils';
import api from './api';

class Search {
    constructor (selector) {
        this.template = loadTemplate('#template-search');
        this.resultsTemplate = loadTemplate('#template-search-results');
        this.el = document.querySelector(selector);
        bindEvents(this, {
            'input': _.throttle(this.changeHandler, 500),
            'blur': this.focusHandler,
            'click': this.clickHandler
        });
    }
    render() {
        this.el.innerHTML = this.template();
        this.results = this.el.querySelector('.results');
    }
    renderResults(json) {
        this.results.innerHTML = this.resultsTemplate(json);
    }
    emptyResults() {
        this.results.innerHTML = '';
    }
    youtube(term, success) {
        fetchJSON(
            'http://gdata.youtube.com/feeds/api/videos', {
                'type': 'video',
                'max-results': 5,
                'alt': 'json',
                'q': term
            },
            success);
    }
    changeHandler(ev) {
        var self = this;
        if (ev.target.value !== '') {
            this.youtube(ev.target.value, function(json) {
                self.renderResults(json);
            });
        } else {
            this.emptyResults();
        }
    }
    focusHandler(ev) {
        this.emptyResults();
    }
    clickHandler(ev) {
        if (ev.target.parentNode.tagName !== 'LI')
            return;
        var link = ev.target.parentNode.getAttribute('data-link');

    }
}

export default Search;

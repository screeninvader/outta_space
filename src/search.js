import _ from 'underscore';
import {loadTemplate, fetchJSON, bindEvents} from './utils';
import api from './api';

var Search = function(selector) {
    this.template = loadTemplate('#template-search');
    this.resultsTemplate = loadTemplate('#template-search-results');
    this.el = document.querySelector(selector);

    bindEvents(this, {
        'input': this.changeHandler,
        'blur': this.focusHandler,
        'click': this.clickHandler
    });
};

Search.prototype = {
    render: function() {
        this.el.innerHTML = this.template();
        this.results = this.el.querySelector('.results');
    },
    renderResults: function(json) {
        this.results.innerHTML = this.resultsTemplate(json);
    },
    emptyResults: function() {
        this.results.innerHTML = '';
    },

    youtube: function(term, success) {
        fetchJSON(
            'http://gdata.youtube.com/feeds/api/videos', {
                'type': 'video',
                'max-results': 5,
                'alt': 'json',
                'q': term
            },
            success);
    },
    changeHandler: _.throttle(function(ev) {
        var self = this;
        if (ev.target.value !== '') {
            this.youtube(ev.target.value, function(json) {
                self.renderResults(json);
            });
        } else {
            this.emptyResults();
        }
    }, 500),
    focusHandler: function(ev) {
        this.emptyResults();
    },
    clickHandler: function(ev) {
        if (ev.target.parentNode.tagName !== 'LI')
            return;
        var link = ev.target.parentNode.getAttribute('data-link');

    }
};

export default Search;

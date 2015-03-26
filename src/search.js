import _ from 'underscore';
import {loadTemplate} from './utils';
import './api';

var Search = function(selector) {
    this.template = loadTemplate('#template-search');
    this.resultsTemplate = loadTemplate('#template-search-results');
    this.el = document.querySelector(selector);
    this.el.addEventListener(
        'input',
        _.throttle(this.changeHandler.bind(this), 500));
    this.el.addEventListener('click', this.clickHandler.bind(this));
};

Search.prototype = {
    render: function() {
        this.el.innerHTML = this.template();
    },
    renderResults: function(json) {
        var el = this.el.querySelector('.results');
        el.innerHTML = this.resultsTemplate(json);
    },
    youtube: function(term, success) {
        utils.fetchJSON(
            'http://gdata.youtube.com/feeds/api/videos', {
                'type': 'video',
                'max-results': 5,
                'alt': 'json',
                'q': term
            },
            success);
    },
    changeHandler: function(ev) {
        var self = this;
        this.youtube(ev.target.value, function(json) {
            console.debug(json);
            self.renderResults(json);
        });
    },
    clickHandler: function(ev) {
        if (ev.target.parentNode.tagName !== 'LI')
            return;
        var link = ev.target.parentNode.getAttribute('data-link');

    }
};

export default Search;

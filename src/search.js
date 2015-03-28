import _ from 'underscore';
import {loadTemplate, fetchJSON, bindEvents} from './utils';
import api from './api';

var searchProviders = {
    youtube: function(term) {
        return fetchJSON('http://gdata.youtube.com/feeds/api/videos', {
            'type': 'video',
            'max-results': 5,
            'alt': 'json',
            'q': term
        }).then((json) => {
            return _.map(json.feed.entry, (entry) => {
                return {
                    title: entry.title.$t,
                    url: entry.media$group.media$player[0].url,
                    duration: entry.media$group.yt$duration.seconds
                };
            });
        });
    }
};


class Search {
    constructor (selector) {
        this.template = loadTemplate('#template-search');
        this.resultsTemplate = loadTemplate('#template-search-results');
        this.el = document.querySelector(selector);
        bindEvents(this, {
            'input': _.throttle(this.changeHandler, 300),
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
    changeHandler(ev) {
        if (ev.target.value !== '') {
            searchProviders.youtube(ev.target.value)
                .then((items) => { this.renderResults({items}); });
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

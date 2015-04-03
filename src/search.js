import _ from 'underscore';
import {loadTemplate, fetchJSON, bindEvent, bindEvents} from './utils';
import config from './config';
import api from './api';

var searchProviders = {
    youtube: (term) => {
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
    },
    soundcloud: (term) => {
        return fetchJSON('http://api.soundcloud.com/tracks.json', {
            'client_id': config.soundcloudClientId,
            'q': term
        }).then((json) => {
            return _.map(_.take(json, 7), (entry) => {
                return {
                    title: entry.title,
                    url: entry.uri,
                    duration: entry.duration
                };
            });
        });
    }
};


class Search {
    constructor (selector) {
        var changeHandler = _.throttle(this.changeHandler, 300);
        this.template = loadTemplate('#template-search');
        this.resultsTemplate = loadTemplate('#template-search-results');
        this.el = document.querySelector(selector);
    }
    render() {
        this.el.innerHTML = this.template();
        this.results = this.el.querySelector('.results');

        bindEvents(this, 'input', {
            'input': this.changeHandler,
            'focus': this.changeHandler,
            'blur': this.blurHandler,
        });
    }
    renderResults(json) {
        this.results.innerHTML = this.resultsTemplate(json);
        bindEvent(this, '.results a', 'click', this.clickHandler);
    }
    emptyResults() {
        setTimeout(() => this.results.innerHTML = '', 300);
    }
    changeHandler(ev) {
        if (ev.target.value !== '') {
            searchProviders.soundcloud(ev.target.value)
                .then((items) => { this.renderResults({items}); });
        } else {
            this.emptyResults();
        }
    }
    blurHandler(ev) {
        this.emptyResults();
    }
    clickHandler(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.showUrl(ev.target.parentNode.getAttribute('data-link'));
    }
}

export default Search;

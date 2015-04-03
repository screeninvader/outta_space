import _ from 'underscore';
import {loadTemplate, fetchJSON, bindEvent, bindEvents} from './utils';
import config from './config';
import api from './api';


var searchProviders = {
    youtube: {
        name: 'YouTube',
        alias: 'yt',
        search: (term) => {
            return fetchJSON('http://gdata.youtube.com/feeds/api/videos', {
                'type': 'video',
                'max-results': 5,
                'alt': 'json',
                'q': term
            }).then((json) => {
                return {
                    items: _.map(json.feed.entry, (entry) => {
                        return {
                            title: entry.title.$t,
                            url: entry.media$group.media$player[0].url,
                            duration: entry.media$group.yt$duration.seconds
                        };
                    })
                }
            });
        },
    },
    soundcloud: {
        name: 'SoundCloud',
        alias: 'sc',
        search: (term) => {
            return fetchJSON('http://api.soundcloud.com/tracks.json', {
                'client_id': config.soundcloudClientId,
                'q': term
            }).then((json) => {
                return {
                    items: _.map(_.take(json, 7), (entry) => {
                        return {
                            title: entry.title,
                            url: entry.uri,
                            duration: entry.duration
                        };
                    })
                };
            });
        }
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
        this.input = this.el.querySelector('input');
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
    renderProviders(providers) {
        this.results.innerHTML = _.map(providers, (provider) => {
            return `<li><strong>${provider.alias}</strong>:
                    ${provider.name}</li>`;
        });
    }

    emptyResults() {
        this.results.innerHTML = '';
    }
    changeHandler(ev) {
        let term = ev.target.value;
        if (term.length > 0) {
            if (term.startsWith('http')) {
                api.showUrl(query);
            } else {
                this.doSearch(term);
            }
        } else {
            this.renderProviders(searchProviders);
        }
    }
    blurHandler(ev) {
        this.input.value = '';
        setTimeout(() => this.emptyResults(), 300);
    }
    clickHandler(ev) {
        // ev.target is the <a> element, parentNode the <li> element.
        api.showUrl(ev.target.parentNode.getAttribute('data-link'));
    }
    doSearch(query) {
        let query_words = query.split(' '),
            provider_alias = _.first(query_words),
            terms = _.rest(query_words).join(' ');
        console.log('alias, terms', provider_alias, terms);

        let matchingProviders = _.filter(searchProviders, (provider, name) => {
            return provider.alias.startsWith(provider_alias)
                || name.startsWith(provider_alias);
        });

        if (terms.length === 0) {
                    this.renderProviders(matchingProviders);
        }

        if (matchingProviders.length === 1 && terms.length > 0) {
            console.log('terms', terms);
            _.first(matchingProviders)
                .search(terms)
                .then(this.renderResults.bind(this));
        }
    }
}
export default Search;

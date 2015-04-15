import _ from 'underscore';
import {fetchJSON, bindEvent, bindEvents, helpers} from './utils';
import config from './config';
import api from './api';


var searchProviders = {
  youtube: {
    name: 'YouTube'
  , alias: 'yt'
  , search: (term) => {
      return fetchJSON('http://gdata.youtube.com/feeds/api/videos', {
        'type': 'video'
      , 'max-results': 25
      , 'alt': 'json'
      , 'q': term
      }).then((json) => {
        return {
          items: _.map(json.feed.entry, (entry) => {
            return {
              title: entry.title.$t
            , url: entry.media$group.media$player[0].url
            , duration: entry.media$group.yt$duration.seconds
            };
          })
        };
      });
    }
  }
, soundcloud: {
    name: 'SoundCloud'
  , alias: 'sc'
  , search: (term) => {
      return fetchJSON('http://api.soundcloud.com/tracks.json', {
        'client_id': config.soundcloudClientId
      , 'q': term
      }).then((json) => {
        return {
          items: _.map(_.take(json, 7), (entry) => {
            return {
              title: entry.title
            , url: entry.uri
            , duration: entry.duration
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
    this.el = document.querySelector(selector);

    document.addEventListener("keydown", ev => {
      if(ev.keyCode == 27) {
        this.emptyResults();
      }
    });
  }

  template(state) {
    state = state || {};
    return _.template(`
      <form>
        <input id="search-url" 
               type="text"
               placeholder="Post something!">
        <input id="search-submit" type="submit" value="Go!" disabled>
      </form>
      <div class="results"></div>
    `)(_.extend(state, helpers));
  }

  resultsTemplate(state) {
    state = state || {};
    return _.template(`
      <div id="search-results">
        <div class="bar">
          <a class="close" href="#">X</a>
        </div>
        <ul>
          <% _.each(items, function(item) { %>
            <li data-link="<%= item.url %>">
              <a class ="item" href="#"><%= item.title %>
                (<%= inMinutes(item.duration) %>)
              </a>
            </li>
          <% }); %>
        </ul>
      </div>
    `)(_.extend(state, helpers));
  }
  
  providersTemplate(state) {
    state = state || {};
    return _.template(`
      <p>Enter an URL directly or search interactively by entering a search
       providers name or alias followed by your search terms.
      "<code>yt Metalab</code>", for example, searches YouTube for
      "Metalab". The following providers are available:</p>
      <ul>
        <% _.each(items, function(item) { %>
          <li>
            <%= item.name %> (<strong><%= item.alias %></strong>)
          </li>
        <% }); %>
      </ul>
    `)(_.extend(state, helpers));
  }

  render() {
    this.el.innerHTML = this.template();
    this.input = this.el.querySelector('input#search-url');
    this.results = this.el.querySelector('.results');
    this.submit = this.el.querySelector('input#search-submit');

    bindEvent(this, '#search form', 'submit', this.submitHandler);
    bindEvents(this, 'input#search-url', {
      'input': this.changeHandler
    , 'focus': this.changeHandler
    , 'blur': this.blurHandler
    });
  }

  renderResults(json) {
    this.results.innerHTML = this.resultsTemplate(json);
    bindEvent(this, '.results .item', 'click', this.clickHandler);
    bindEvents(this, "#search-results .close", {
      "click": ev => { this.emptyResults(); }
    });
  }

  renderProviders(items) {
    this.results.innerHTML = this.providersTemplate({items});
  }

  emptyResults() {
    this.results.innerHTML = '';
  }

  changeHandler(ev) {
    let term = ev.target.value;
    this.submit.disabled = true;
    if (term.length > 0) {
      if (term.startsWith('http')) {
        this.submit.disabled = false;
      } else {
        this.doSearch(term);
      }
    } else {
      this.renderProviders(searchProviders);
    }
  }

  submitHandler(ev) {
    ev.preventDefault();
    if (this.input.value.startsWith('http')) {
      api.showUrl(this.input.value);
    }
  }

  blurHandler(ev) {
     this.input.value = '';
  }

  clickHandler(ev) {
    // ev.target is the <a> element, parentNode the <li> element.
    api.showUrl(ev.target.parentNode.getAttribute('data-link'));
  }

  doSearch(query) {
    let queryWords = query.split(' ')
      , providerAlias = _.first(queryWords)
      , terms = _.rest(queryWords).join(' ')
    ;
    console.log('alias, terms', providerAlias, terms);

    let matchingProviders = _.filter(searchProviders, (provider, name) => {
      return (provider.alias.startsWith(providerAlias) ||
              name.startsWith(providerAlias));
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

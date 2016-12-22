import _ from 'underscore';
import {fetchJSON, bindEvent, bindEvents, helpers} from './utils';
import config from './config';
import api from './api';


var searchProviders = {
  video: {
    name: 'Video'
  , alias: 'v'
  , search: (term) => {
      return fetchJSON('http://' + window.location.host + '/searx/', {
        'categories': 'videos'
      , 'format': 'json'
      , 'q': term
      }).then((json) => {
        return {
          items: _.map(json.results, (entry) => {
            return {
              title: entry.title
            , url: entry.magnetlink ? entry.magnetlink : entry.url
            , thumbnail: entry.thumbnail
            , content: entry.content
            };
          })
        };
      });
    }
  }
, music: {
    name: 'Music'
  , alias: 'm'
  , search: (term) => {
      return fetchJSON('http://' + window.location.host + '/searx/', {
        'categories': 'music'
      , 'format': 'json'
      , 'q': term
      }).then((json) => {
        return {
          items: _.map(json.results, (entry) => {
            return {
              title: entry.title
            , url: entry.magnetlink ? entry.magnetlink : entry.url
            , thumbnail: entry.thumbnail
            , content: entry.content
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

    document.addEventListener('keyup', ev => {
      if(ev.keyCode === 27) { //esc key
        let searchInput = document.querySelector('#search-url');
        searchInput.innerHTML = '';
        searchInput.blur();
        this.emptyResults();
      } else if(ev.keyCode === 70 ) { //f key
        this.toggleFocus('');
      }
    });

    this.doSearch = _.debounce(this.doSearchDebounced.bind(this), config.searchDebounceWait);
  }

  toggleFocus(provider) {
    var searchInput = document.querySelector('#search-url')
      , activeEle   = document.activeElement
    ;
    if ( activeEle.getAttribute('id') !== searchInput.getAttribute('id') ) {
      searchInput.focus();
      if ( provider ) {
        searchInput.value = provider + ' ';
      }
    }
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
              <img src="<%= item.thumbnail %>" alt="thumbnail">
              <div>
                <a class ="item" href="#">
                  <%= item.title %>
                </a>
                <p>
                  <%= item.content %>
                </p>
              </div>
            </li>
          <% }); %>
        </ul>
      </div>
    `)(_.extend(state, helpers));
  }

  providersTemplate(state) {
    state = state || {};
    return _.template(`
      <p>Enter a URL directly or search for content on the internet.
      You can optionally use one of the prefixes below to search for
      specific content types.</p>
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
    bindEvents(this, '#search-results .close', {
      'click': ev => { this.emptyResults(); }
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
      if (term.startsWith('http') || term.startsWith("rtmp") || term.startsWith("magnet")) {
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
    if (this.input.value.startsWith('http') || this.input.value.startsWith('rtmp') || this.input.value.startsWith('magnet')) {
      api.showUrl(this.input.value);
      this.input.value = '';
    }
  }

  blurHandler(ev) {
    if(! ev.relatedTarget || ev.relatedTarget.type !== "submit"){
      this.input.value = '';
    }
  }

  clickHandler(ev) {
    // ev.target is the <a> element, parentNode the <li> element.
    api.showUrl(ev.target.parentNode.getAttribute('data-link'));
  }

  doSearchDebounced(query) {
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

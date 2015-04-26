import '../node_modules/babelify/node_modules/babel-core/browser-polyfill.js';

import _ from 'underscore';
import api from './api';
import Playlist from './playlist';
import Browser from './browser';
import Controls from './controls';
import Search from './search';
import Shairport from './shairport';
import notify from './notify';

// we seem to need DOMContentLoaded here, because script tags,
// including our mustache templates aren't necessarily loaded
// on document.load().
document.addEventListener('DOMContentLoaded', ev => {
  var playlist = new Playlist('#playlist')
    , controls = new Controls('#controls')
    , search = new Search('#search')
    , browser = new Browser('#browser')
    , shairport = new Shairport('#shairport')
    ;

  api.onError((error) => {
    notify.exception("Can't connect to ScreenInvader");
  });

  // search.render is called here once for the initial search box and
  // gets updated if it's own change handler is triggered, because it
  // works completely independent from state updates.
  let renderOnce = _.once(() => {
    search.render();
  });

  api.onReceive((state) => {
    renderOnce();
    console.debug('Rerendering...');
    playlist.render(state);
    controls.render(state);
    browser.render(state);
    shairport.render(state);
  });
});

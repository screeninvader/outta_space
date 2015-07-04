import '../node_modules/babelify/node_modules/babel-core/browser-polyfill.js';

import _ from 'underscore';
import api from './api';
import Playlist from './playlist';
import Browser from './browser';
import Controls from './controls';
import Search from './search';
import Modes from './modes';
import Notify from './notify';
import Peerflix from './peerflix';

function peerflixReload(peerflix) {
    peerflix.render();
    setTimeout(function(){ peerflixReload(peerflix); }, 1000);
}
// we seem to need DOMContentLoaded here, because script tags,
// including our mustache templates aren't necessarily loaded
// on document.load().
document.addEventListener('DOMContentLoaded', ev => {
  var playlist = new Playlist('#playlist')
    , controls = new Controls('#controls')
    , search = new Search('#search')
    , browser = new Browser('#browser')
    , modes = new Modes('#modes')
    , peerflix = new Peerflix('#peerflix')
    ;

  api.onError((error) => {
    Notify.exception("Can't connect to ScreenInvader");
  });

  // search.render is called here once for the initial search box and
  // gets updated if it's own change handler is triggered, because it
  // works completely independent from state updates.
  let renderOnce = _.once(() => {
    search.render();
  });

  //peerflix doesn't use the janosh state at all. instead it does its own polling.
  peerflixReload(peerflix);

  api.onReceive(_.debounce((state) => {
    renderOnce();
    console.debug('Rerendering...');
    playlist.render(state);
    controls.render(state);
    browser.render(state);
    modes.render(state);
  }, 200));
});

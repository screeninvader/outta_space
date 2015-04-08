import _ from 'underscore';
import api from './api';
import Playlist from './playlist';
import Controls from './controls';
import Search from './search';

// we seem to need DOMContentLoaded here, because script tags,
// including our mustache templates aren't necessarily loaded
// on document.load().
document.addEventListener('DOMContentLoaded', ev => {
  var playlist = new Playlist('#playlist')
    , controls = new Controls('#controls')
    , search = new Search('#search')
  ;

  api.onError((error) => {
    document.body.innerHTML = "Can't connect to server. Bug your admins!";
  });

  api.onReceive(state => {
    console.debug('Rerendering...');
    search.init();
    playlist.render(state);
    controls.render(state);
  });
});

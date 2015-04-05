import api from './api';
import Playlist from './playlist';
import Controls from './controls';
import Search from './search';

// we seem to need DOMContentLoaded here, because script tags,
// including our mustache templates aren't necessarily loaded
// on document.load().
document.addEventListener('DOMContentLoaded', ev => {
  var playlist = new Playlist('#playlist'),
      controls = new Controls('#controls'),
      search = new Search('#search');

  // search.render is called here once for the initial search box and
  // gets updated if it's own change handler is triggered, because it
  // works completely independent from state updates.
  search.render();

  api.onReceive(state => {
    console.debug('Rerendering...');
    playlist.render(state);
    controls.render(state);

  });
});

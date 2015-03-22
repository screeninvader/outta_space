(function(global) {
    'use strict';
    var api = require('./api');
    var Playlist = require('./playlist');
    var Controls = require('./controls');
    var Search = require('./search');

    // we seem to need DOMContentLoaded here, because script tags,
    // including our mustache templates aren't necessarily loaded
    // on document.load().
    document.addEventListener("DOMContentLoaded", function (ev) {
        var playlist = new Playlist('#playlist'),
            controls = new Controls('#controls'),
            search = new Search('#search');

        // search.render is called here once for the initial search box and
        // gets updated if it's own change handler is triggered, because it
        // works completely independent from state updates.
        search.render();

        api.onReceive(function(state) {
            playlist.render(state);
            controls.render(state);

        });
    });
})(window);

(function(global) {
    'use strict';
    var api = require('./api');
    var Playlist = require('./playlist');
    var Controls = require('./controls');

    // we seem to need DOMContentLoaded here, because script tags,
    // including our mustache templates aren't necessarily loaded
    // on document.load().
    document.addEventListener("DOMContentLoaded", function (ev) {
        var playlist = new Playlist('#playlist'),
            controls = new Controls('#controls');

        api.onReceive(function(state) {
            playlist.render(state);
            controls.render(state);
        });
    });
})(window);

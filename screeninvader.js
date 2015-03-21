(function(global) {
    'use strict';
    // # Config
    var socket_uri = 'ws://10.20.30.40:8082';

    // # API

    var API = function(uri) {
        this.callbacks = [];
        this.socket = new WebSocket(uri);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
    };

    API.prototype = {
        onReceive: function(callback) {
            console.log(callback);
            this.callbacks.push(callback);
        },
        onMessage: function(ev) {
            var state = JSON.parse(ev.data);
            console.debug('received state update', state);
            this.callbacks.forEach(function(callback) {
                callback.call(this, state);
            });
        },
        onError: function(ev) {
            console.error(ev);
        },
        onOpen: function(ev) {
            this.socket.send('setup');
        },
    };

    // # UI

    Handlebars.registerHelper('is_active', function(current, active) {
        return current === parseInt(active) ? 'active' : '';
    });

    Handlebars.registerHelper('odd_even', function(index) {
        return index % 2 ? 'odd' : 'even';
    });

    var Playlist = function(el) {
        this.template = Handlebars.compile(
            document
                .querySelector('#template-playlist')
                .innerHTML);
        this.el = el;
        this.el.addEventListener('click', this.item_click_handler);
    };

    Playlist.prototype = {
        render: function(state) {
            this.el.innerHTML = this.template(state.playlist);
        },
        item_click_handler: function(ev) {
            // only handle clicks on children, not on this.el itself.
            if (ev.target === ev.currentTarget)
                return;
            console.log(ev.target.innerHTML);
        }
    };

    // # Setup
    //
    // we seem to need DOMContentLoaded here, because script tags,
    // including our mustache templates aren't necessarily loaded
    // on document.load().
    document.addEventListener("DOMContentLoaded", function (ev) {

        var api = new API(socket_uri),
            playlist = new Playlist(document.querySelector('#playlist'));

        api.onReceive(function(state) {
            playlist.render(state);
        });
    });
})(window);

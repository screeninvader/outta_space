var Handlebars = require('handlebars');

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
            this.callbacks.push(callback);
        },
        onMessage: function(ev) {
            var self = this;
            self.state = JSON.parse(ev.data);
            console.debug('received state update', self.state);
            this.callbacks.forEach(function(callback) {
                callback.call(self, self.state);
            });
        },
        onError: function(ev) {
            console.error(ev);
        },
        onOpen: function(ev) {
            this.socket.send('setup');
        },
        command: function() {
            this.socket.send(
                JSON.stringify(
                    Array.prototype.slice.call(
                        arguments)));
        },
        set: function (key, value) {
            console.debug('setting', key, 'to', value);
            this.command('trigger', key, value);
        },
        jump: function (index) {
            this.set('/playlist/index', index);
        },
        previous: function () {
            if (parseInt(this.state.playlist.index) - 1 >= 0) {
                this.jump(parseInt(this.state.playlist.index) - 1);
            }
        },
        next: function () {
            if (parseInt(this.state.playlist.index) + 1 <= this.state.playlist.items.length) {
                this.jump(parseInt(this.state.playlist.index) + 1);
            }
        },
        play: function () {
            this.set('/player/active', 'true');
        },
        pause: function () {
            this.set('/player/active', 'false');
        },
        'volume-increase': function () {
            if (this.state.sound.volume <= 90) {
                this.set('/sound/volume', parseInt(this.state.sound.volume) + 10);
            }
        },
        'volume-decrease': function () {
            if (this.state.sound.volume >= 10) {
                this.set('/sound/volume', parseInt(this.state.sound.volume) - 10);
            }
        },

    };
    var api = window.api = new API(socket_uri);

    // # UI
    // Please treat "state" as read-only/immutable.

    Handlebars.registerHelper('is_active', function(current, active) {
        return current === parseInt(active) ? 'active' : '';
    });

    Handlebars.registerHelper('odd_even', function(index) {
        return index % 2 ? 'odd' : 'even';
    });

    var load_template = function(selector) {
        var el = document.querySelector(selector);
        return Handlebars.compile(el.innerHTML);
    };


    var Controls = function(selector) {
        this.el = document.querySelector(selector);
        this.template = load_template('#template-controls');
        this.actions = [
            'previous', 'play', 'pause', 'next',
            'volume-increase', 'volume-decrease'];
        this.el.addEventListener('click', this.item_click_handler);
    };

    Controls.prototype = {
        render: function(state) {
            this.el.innerHTML = this.template({actions: this.actions});
        },
        item_click_handler: function(ev) {
            // only handle clicks on children, not on this.el itself.
            if (ev.target === ev.currentTarget)
                return;
            api[ev.target.id]();

        }
    };

    var Playlist = function(selector) {
        this.el = document.querySelector(selector);
        this.template = load_template('#template-playlist');
        this.el.addEventListener('click', this.item_click_handler);
    };

    Playlist.prototype = {
        render: function(state) {
            this.el.innerHTML = this.template(state.playlist);
        },
        item_click_handler: function(ev) {
            // ev.target is the <a> element, parentNode the <li> element.
            api.jump(ev.target.parentNode.getAttribute('data-id'));
        }
    };

    // # Setup
    //
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

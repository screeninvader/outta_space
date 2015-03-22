(function(global) {
    'use strict';

    var config = require('./config');

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

    module.exports = new API(config.socket_uri);
})(window);

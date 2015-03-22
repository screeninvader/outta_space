(function(global) {
    'use strict';
    var utils = require('./utils');
    var api = require('./api');

    var Controls = function(selector) {
        this.el = document.querySelector(selector);
        this.template = utils.loadTemplate('#template-controls');
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

    module.exports = Controls;
})(window);

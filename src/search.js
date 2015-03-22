(function(global) {
    'use strict';
    var _ = require('underscore');
    var utils = require('./utils');

    var Search = function(selector) {
        this.template = utils.loadTemplate('#template-search');
        this.results_template = utils.loadTemplate('#template-search-results');
        this.el = document.querySelector(selector);
        this.el.addEventListener(
            'input',
            _.throttle(this.change_handler.bind(this), 500));
        this.el.addEventListener('click', this.click_handler.bind(this));
    };

    Search.prototype = {
        render: function() {
            this.el.innerHTML = this.template();
        },
        render_results: function(json) {
            var el = this.el.querySelector('.results');
            el.innerHTML = this.results_template(json);
        },
        youtube: function(term, success) {
            utils.fetchJSON(
                'http://gdata.youtube.com/feeds/api/videos', {
                    'type': 'video',
                    'max-results': 5,
                    'alt': 'json',
                    'q': term
                },
                success);
        },
        change_handler: function(ev) {
            var self = this;
            this.youtube(ev.target.value, function(json) {
                console.debug(json);
                self.render_results(json);
            });
        },
        click_handler: function(ev) {
            if (ev.target.parentNode.tagName !== 'LI')
                return;
            var link = ev.target.parentNode.getAttribute('data-link');

        }
    };

    module.exports = Search;
})(window);

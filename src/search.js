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
    };

    Search.prototype = {
        render: function(search_results) {
            this.el.innerHTML = this.template();
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
            var self = this,
                el = self.el.querySelector('.results');
            this.youtube(ev.target.value, function(json) {
                el.innerHTML = self.results_template(json);
            });
        }
    };

    module.exports = Search;
})(window);

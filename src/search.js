(function(global) {
    'use strict';

    var Search = function(selector) {
        this.el = document.querySelector(selector);
    };

    Search.prototype = {
        render: function(state) {
            this.el.innerHTML = this.template(state.search);
        },
        youtube: function(term) {
            fetchJSON(
                'http://gdata.youtube.com/feeds/api/videos', {
                    'type': 'video',
                    'max-results': 5,
                    'alt': 'json',
                    'q': term
                },
                function(json) { console.debug(json); });
        }
    };

    module.exports = Search;
})(window);

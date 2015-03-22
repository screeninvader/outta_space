(function(global) {
    'use strict';
    var Handlebars = require('handlebars');
    var querystring = require('querystring');

    Handlebars.registerHelper('is_active', function(current, active) {
        return current === parseInt(active) ? 'active' : '';
    });

    Handlebars.registerHelper('odd_even', function(index) {
        return index % 2 ? 'odd' : 'even';
    });

    module.exports = {
        fetchJSON: function(url, parameters, success) {
            var request = new XMLHttpRequest();
            url += '?' + querystring.stringify(parameters);
            request.onload = function() { success(this.response); };
            request.open('get', url, true);
            request.responseType = 'json';
            request.send();
        },
        loadTemplate: function(selector) {
            var el = document.querySelector(selector);
            return Handlebars.compile(el.innerHTML);
        }
    };
})(window);

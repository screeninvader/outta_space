import _ from 'underscore';
import querystring from 'querystring';

var fetchJSON = function(url, parameters, success) {
        var request = new XMLHttpRequest();
        url += '?' + querystring.stringify(parameters);
        request.onload = function() { success(this.response); };
        request.open('get', url, true);
        request.responseType = 'json';
        request.send();
};

var helpers = {
    isActive: function(current, active) {
        return current === parseInt(active) ? 'active' : '';
    },
    oddEven: function(index) {
        return index % 2 ? 'odd' : 'even';
    },
    inMinutes: function(seconds) {
        return Math.floor(seconds / 60) + ':' + (seconds % 60);
    }
};

var loadTemplate = function(selector) {
    var el = document.querySelector(selector);
    return function(context) {
        return _.template(el.innerHTML)(_.extend(context, helpers));
    };
};

var bindEvent = function(self, event, handler) {
    return self.el.addEventListener(event, handler.bind(self), true);
};

var bindEvents = function(self, data) {
    return _.map(data, function(handler, event) {
        return bindEvent(self, event, handler);
    });
};

export { fetchJSON, loadTemplate, bindEvent, bindEvents };

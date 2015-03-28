import _ from 'underscore';
import querystring from 'querystring';

function fetchJSON(url, parameters) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        url += '?' + querystring.stringify(parameters);
        request.onload = function() { resolve(this.response); };
        request.onerror = function(e) { reject(e); };
        request.open('get', url, true);
        request.responseType = 'json';
        request.send();
    });
}

var helpers = {
    isActive(current, active) {
        return current === parseInt(active) ? 'active' : '';
    },
    oddEven(index) {
        return index % 2 ? 'odd' : 'even';
    },
    inMinutes(seconds) {
        return Math.floor(seconds / 60) + ':' + (seconds % 60);
    }
};

function loadTemplate(selector) {
    var el = document.querySelector(selector);
    return function(context) {
        return _.template(el.innerHTML)(_.extend(context, helpers));
    };
}

function bindEvent(self, event, handler) {
    return self.el.addEventListener(event, handler.bind(self), true);
}

function bindEvents(self, data) {
    return _.map(data, function(handler, event) {
        return bindEvent(self, event, handler);
    });
}

export { fetchJSON, loadTemplate, bindEvent, bindEvents };

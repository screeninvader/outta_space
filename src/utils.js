import Handlebars from 'handlebars';
import 'querystring';

Handlebars.registerHelper('is_active', function(current, active) {
    return current === parseInt(active) ? 'active' : '';
});

Handlebars.registerHelper('odd_even', function(index) {
    return index % 2 ? 'odd' : 'even';
});

Handlebars.registerHelper('in_minutes', function(seconds) {
    return Math.floor(seconds / 60) + ":" + (seconds % 60);
});

var fetchJSON = function(url, parameters, success) {
        var request = new XMLHttpRequest();
        url += '?' + querystring.stringify(parameters);
        request.onload = function() { success(this.response); };
        request.open('get', url, true);
        request.responseType = 'json';
        request.send();
};

var loadTemplate = function(selector) {
    var el = document.querySelector(selector);
    return Handlebars.compile(el.innerHTML);
};

export { fetchJSON, loadTemplate };

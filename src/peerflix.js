import _ from 'underscore';
import {fetchJSON, bindEvent, helpers} from './utils';
import api from './api';

class Peerflix {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  template(state) {
    state = state || {};
    console.log(state);

    return _.template(` 
      <div class="torrents">
        <div class="header">Torrent Manager<a class="close">X</a></div>
          <a class="stop">
            Stop torrents
          </a>
          <% if(items[0] === undefined) { %>
            No torrents
          <% } else { %>
            <ul>
              <%  _.each(items, function(item, current) { %>
               <% _.each(item.files, function(file, current) { %>
                 <li link="<%= file.link %>">
                    <div>
                      <a class="item"><%= file.name %></a>
                    </div>
                  </li>
                <% }); %>
              <% }); %>
            </ul>
          <% } %>
      </div>
    `)(_.extend(state, helpers));
  }

  setHTML(json) {
    this.el.innerHTML = this.template(json);
    bindEvent(this, '.item', 'click', this.clickHandler);
    bindEvent(this, '.resume', 'click', this.resumeHandler);
    bindEvent(this, '.stop', 'click', this.stopHandler);
    bindEvent(this, '.close', 'click', this.closeHandler);
  }

  render() {
    fetchJSON('http://' + window.location.host + '/peerflix/torrents', {}).then(function(json) { return { items: json } }).catch(err => { alert(err); return { items: "" } }).then(this.setHTML.bind(this));

/*    bindEvent(this, '.expand', 'click', this.expandHandler);
    bindEvent(this, '#clear', 'click', this.clearHandler);
    bindEvent(this, '#export', 'click', this.exportHandler);'
*/
  }

  clickHandler(ev) {
    api.showUrl('http://' + window.location.host + '/peerflix/' + ev.target.parentNode.parentNode.getAttribute('link'));
  }

  resumeHandler(ev) {
    api.peerflix["start"]();
  }

  stopHandler(ev) {
    api.peerflix["stop"]();
  }

  closeHandler(ev) {
    this.el.style.visibility = "hidden";
  }
}

export default Peerflix;

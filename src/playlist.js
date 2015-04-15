import _ from 'underscore';
import Sortable from 'sortablejs';
import {bindEvent, helpers} from './utils';
import api from './api';

class Playlist {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  template(state) {
    state = state || {};
    return _.template(`
      <ul>
        <% _.each(items, function(item, current) { %>
          <li id="<%= current %>" data-id="<%= current %>"
              class="<%= isActive(current, index) %>
                     <%= oddEven(current) %>">
            <div>
              <a class="item" href="#<%= current %>"><%= item.title %></a>
              <a class="remove">X</a>
              <a class="expand">...</a>
            </div>
            <div class="expanded">
              <a target="_blank" href="<%= item.source %>">Website</a>
              <a href="<%= item.url %>">Download</a>
            </div>
          </li>
        <% }); %>
      </ul>
      <div class="bar"><span id="clear">clear playlist</span></div>
    `)(_.extend(state, helpers));
  }


  render(state) {
    this.el.innerHTML = this.template(state.playlist);
    bindEvent(this, '.item', 'click', this.clickHandler);
    bindEvent(this, '.remove', 'click', this.removeHandler);
    bindEvent(this, '.expand', 'click', this.expandHandler);
    bindEvent(this, '#clear', 'click', this.clearHandler);
    var sort = Sortable.create(document.querySelector('#playlist ul'), {
      animation: 0, // ms, animation speed moving items when sorting, `0` — without animation
      handle: 'ul', // Restricts sort start click/touch to the specified element
      draggable: 'li', // Specifies which items inside the element should be sortable
      onUpdate: function (evt){
        api.playlist.shift(evt.oldIndex, evt.newIndex);
      }
    });
  }
  clickHandler(ev) {
    // ev.target is the <a> element, parentNode.parentNode the <li> element.
    api.player.jump(ev.target.parentNode.parentNode.getAttribute('data-id'));
  }
  removeHandler(ev) {
    api.playlist.remove(ev.target.parentNode.parentNode.getAttribute('data-id'));
  }
  expandHandler(ev) {
    var expanded = ev.target.parentNode.parentNode.querySelector('.expanded');
    if(expanded.style.display !== 'inline-block')
      expanded.style.display = 'inline-block';
    else
      expanded.style.display = 'none';
  }
  clearHandler(ev) {
    api.playlist.clear();
  }
}

export default Playlist;

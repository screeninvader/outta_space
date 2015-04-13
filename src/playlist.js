import {loadTemplate, bindEvent} from './utils';
import api from './api';
import Sortable from 'sortablejs';

class Playlist {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.template = loadTemplate('#template-playlist');
  }
  render(state) {
    this.el.innerHTML = this.template(state.playlist);
    bindEvent(this, '.item', 'click', this.clickHandler);
    bindEvent(this, '.remove', 'click', this.removeHandler);
    bindEvent(this, '.expand', 'click', this.expandHandler);
    var sort = Sortable.create(document.querySelector("#playlist ul"), {
      animation: 0, // ms, animation speed moving items when sorting, `0` — without animation
      handle: "ul", // Restricts sort start click/touch to the specified element
      draggable: "li", // Specifies which items inside the element should be sortable
      onUpdate: function (evt/**Event*/){
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
    var expanded = ev.target.parentNode.parentNode.querySelector(".expanded");
    if(expanded.style.display !== 'inline-block')
      expanded.style.display = 'inline-block';
    else
      expanded.style.display = 'none';
  }
}

export default Playlist;

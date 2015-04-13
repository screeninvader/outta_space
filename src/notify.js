import api from './api';
import humane from 'humane-js';

class Notify {
  constructor() {
  }  

  normal(msg) {
    humane.log(msg, { timeout: 1000, baseCls: 'humane-libnotify' });
  }

  long(msg) {
    humane.log(msg, { timeout: 3000, baseCls: 'humane-libnotify' });
  }

  exception(msg) {
    humane.log(msg, { timeout: 5000, baseCls: 'humane-libnotify-error' });
  }
}

var notify = new Notify();
api.subscribe("notifySend", notify.normal);
api.subscribe("notifyLong", notify.long);
api.subscribe("notifyException", notify.exception);

export default notify;

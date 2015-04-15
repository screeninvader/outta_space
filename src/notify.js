import api from './api';
import humane from 'humane-js';

class Notify {
  constructor() {
  }  

  normal(msg) {
    humane.log(msg, { timeout: 1000, baseCls: 'humane-flatty' });
  }

  long(msg) {
    humane.log(msg, { timeout: 3000, baseCls: 'humane-flatty' });
  }

  exception(msg) {
    humane.log(msg, { timeout: 5000, baseCls: 'humane-flatty-error' });
  }
}

var notify = new Notify();
api.subscribe('notifySend', notify.normal);
api.subscribe('notifyLong', notify.long);
api.subscribe('notifyException', notify.exception);

export default notify;

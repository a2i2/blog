import Vue from 'vue'
import Vuex from 'vuex'
import * as socketio from '../plugins/socketio';
import chat from './chat';
import game from './game';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  actions: {
    SEND_EVENT({}, event) {
      socketio.sendEvent(event);
    }
  },
  modules: {
    chat,
    game
  }
});

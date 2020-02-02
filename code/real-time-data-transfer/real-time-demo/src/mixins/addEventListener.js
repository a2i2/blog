import * as socketio from '../plugins/socketio';

export const addEventListener = {
  methods: {
    addEventListener(eventType, eventCallback) {
      socketio.addEventListener({
        type: eventType,
        callback: eventCallback
      });
    }
  }
};

import Vue from 'vue';

export default {
  strict: false,
  namespaced: true,
  state: () => ({
    users: [],
    history: []
  }),
  getters: {
    GET_USERS: (state) => {
      return state.users;
    },
    GET_HISTORY: (state) => {
      return state.history;
    }
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    ADD_USER(state, user) {
      Vue.set(state.users, user.userID, user);
    },
    SET_HISTORY(state, history) {
      state.history = history;
    },
    ADD_MESSAGE(state, message) {
      Vue.set(state.history, message.id, message);
    }
  },
  actions: {
    RECEIVE_USERS({ commit }, users) {
      commit('SET_USERS', users);
    },
    RECEIVE_USER({ commit }, user) {
      commit('ADD_USER', user);
    },
    RECEIVE_HISTORY({ commit }, history) {
      commit('SET_HISTORY', history);
    },
    RECEIVE_MESSAGE({ commit }, message) {
      commit('ADD_MESSAGE', message);
    }
  }
};

import Vue from 'vue';

export default {
  strict: false,
  namespaced: true,
  state: () => ({
    tiles: {}
  }),
  getters: {
    GET_TILES: (state) => {
      return state.tiles;
    }
  },
  mutations: {
    SET_TILES(state, tiles) {
      state.tiles = tiles;
    },
    ADD_TILE(state, tile) {
      Vue.set(state.tiles, tile.id, tile);
    },
    REMOVE_TILE(state, tileID) {
      Vue.delete(state.tiles, tileID);
    }
  },
  actions: {
    RECEIVE_TILES({ commit }, tiles) {
      commit('SET_TILES', tiles);
    },
    ACTIVATE_TILE({ commit }, tile) {
      commit('ADD_TILE', tile);
    },
    DEACTIVATE_TILE({ commit }, tileID) {
      commit('REMOVE_TILE', tileID);
    }
  }
};

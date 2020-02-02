<template>
  <v-card class="elevation-0">
    <v-card-title>
      Move the mouse to fill in the whole game board
    </v-card-title>
    <v-card-text>
      It’s not impossible, but friends make it a lot easier!
    </v-card-text>
    <v-card-text class="game">
      <div
        class="board"
        :style="boardWidth()"
      >
        <div v-for="x in gameCols" :key="x">
          <div v-for="y in gameRows" :key="y">
            <div
              :class="getClass(x, y)"
              :style="getStyle()"
              @mouseenter="activateTile(x, y)"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="isCompleted"
        class="overlay"
        :style="boardWidth()"
      >
        Congratulations!
      </div>
    </v-card-text>
    <v-card-title v-if="isCompleted">
      <v-btn @click="resetGame()">Reset</v-btn>
    </v-card-title>
    <v-card-title v-else>
      {{ percentCompleted }}% completed
    </v-card-title>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { addEventListener } from '../mixins/addEventListener';

export default {
  name: 'Game',
  mixins: [addEventListener],
  data() {
    return {
      tileWidth: 32,
      tileHeight: 32,
      gameRows: 20,
      gameCols: 20,
      isCompleted: false
    };
  },
  computed: {
    ...mapGetters({
      ACTIVE_TILES: 'game/GET_TILES'
    }),
    activeTiles() {
      return this.ACTIVE_TILES ? this.ACTIVE_TILES : {};
    },
    percentCompleted() {
      const numTiles = this.gameRows * this.gameCols;
      const numActive = Object.keys(this.activeTiles).length;

      return Math.floor((numActive / numTiles) * 100);
    }
  },
  mounted() {
    this.addEventListener('activeTiles', (activeTiles) => {
      this.$store.dispatch('game/RECEIVE_TILES', activeTiles);
    });

    this.addEventListener('activateTile', (tile) => {
      this.$store.dispatch('game/ACTIVATE_TILE', tile);
    });

    this.addEventListener('deactivateTile', (tileID) => {
      this.$store.dispatch('game/DEACTIVATE_TILE', tileID);
    });

    this.addEventListener('gameCompleted', () => {
      this.isCompleted = true;
    });

    this.addEventListener('resetGame', () => {
      this.$store.dispatch('game/RECEIVE_TILES', {});
      this.isCompleted = false;
    });
  },
  methods: {
    activateTile(x, y) {
      this.$store.dispatch('SEND_EVENT', {
        type: 'activateTile',
        data: {
          x: x,
          y: y
        }
      });
    },
    isActive(x, y) {
      return this.activeTiles.hasOwnProperty(`${x},${y}`);
    },
    getClass(x, y) {
      let returnClass = 'tile';
      
      if (this.isCompleted) {
        returnClass = returnClass + ' completed';
      } else if (this.isActive(x, y)) {
        returnClass = returnClass + ' active';
      }

      return returnClass;
    },
    getStyle() {
      const width = 'width: ' + this.tileWidth + 'px;';
      const height = 'height: ' + this.tileHeight + 'px;';

      return width + ' ' + height;
    },
    boardWidth() {
      return 'width: ' + this.tileWidth * this.gameCols + 'px;';
    },
    resetGame() {
      this.$store.dispatch('SEND_EVENT', {
        type: 'resetGame'
      });
    }
  },
  watch: {
    percentCompleted(newValue) {
      if (newValue === 100) {
        this.$store.dispatch('SEND_EVENT', {
          type: 'allTilesActive',
          data: this.gameRows * this.gameCols
        });
      }
    }
  }
};
</script>

<style scoped>
.game {
  position: relative;
}

.board {
  display: flex;
  background-color: lightgrey;
  border-radius: 0 !important;
  padding: 0 !important;
}

.overlay {
  position: absolute;
  top: calc(50% - 24px);
  text-align: center;
  font-size: 48px;
  color: white;
}

.tile.active {
  background-color: blue;
}

.tile.completed {
  background-color: green;
}
</style>

<template>
  <div>
    <v-card-title>
      Move the mouse to fill in the whole game board
    </v-card-title>
    <v-card-text>
      It's not impossible, but friends make it a lot easier!
    </v-card-text>
    <v-card-text v-if="gameLoaded" class="game">
      <div class="d-flex pa-0 grey lighten-2 board">
        <div v-for="x in gameDifficulty.gridSize" :key="x">
          <div v-for="y in gameDifficulty.gridSize" :key="y">
            <div
              :class="getTileClass(x, y)"
              :style="tileStyle"
              @mouseenter="activateTile(x, y)"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="isCompleted"
        class="text-h3 white--text text-center overlay"
      >
        Congratulations!
      </div>
    </v-card-text>
    <v-card-title v-if="isCompleted">
      <v-col cols="3">
        <v-select
          v-model="selectedDifficulty"
          :items="difficultyLevelOptions"
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-btn @click="resetGame(selectedDifficulty)">Reset</v-btn>
      </v-col>
    </v-card-title>
    <v-card-title v-else>
      <div v-if="gameLoaded">{{ percentCompleted }}% completed</div>
    </v-card-title>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addEventListener } from '../mixins/addEventListener';

export default {
  name: 'Game',
  mixins: [addEventListener],
  data: () => ({
    isCompleted: false,
    deleteTileID: undefined,
    difficultyLevels: {},
    gameDifficulty: undefined,
    selectedDifficulty: undefined,
    gameLoaded: false
  }),
  computed: {
    ...mapGetters({
      ACTIVE_TILES: 'game/GET_TILES'
    }),
    activeTiles() {
      return this.ACTIVE_TILES ? this.ACTIVE_TILES : {};
    },
    tileStyle() {
      const width = `width: ${this.gameDifficulty.tileSize}px;`;
      const height = `height: ${this.gameDifficulty.tileSize}px;`;

      return `${width} ${height}`;
    },
    percentCompleted() {
      if (!this.gameLoaded) return 0;

      const numTiles =
        this.gameDifficulty.gridSize * this.gameDifficulty.gridSize;
        
      const numActive = Object.keys(this.activeTiles).length;
      
      return Math.floor((numActive / numTiles) * 100);
    },
    difficultyLevelOptions() {
      return Object.values(this.difficultyLevels)
        .map(difficulty => difficulty.name);
    },
  },
  mounted() {
    this.addEventListener('activeTiles', (activeTiles) => {
      this.$store.dispatch('game/RECEIVE_TILES', activeTiles);
    });

    this.addEventListener('setDifficultyLevels', (difficultyLevels) => {
      this.difficultyLevels = difficultyLevels;
    });

    this.addEventListener('gameDifficulty', (gameDifficulty) => {
      this.gameDifficulty = gameDifficulty;
      this.selectedDifficulty = gameDifficulty.name;
    });

    this.addEventListener('activateTile', (tile) => {
      this.$store.dispatch('game/ACTIVATE_TILE', tile);
    });

    this.addEventListener('deactivateTile', (tileID) => {
      this.deleteTileID = tileID;

      setTimeout(() => {
        this.deleteTileID = undefined;
      }, 125);

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
    isDeleting(x, y) {
      return this.deleteTileID === `${x},${y}`;
    },
    getTileClass(x, y) {
      let tileClass = 'tile';

      if (this.isCompleted) {
        tileClass += ' green';
      } else if (this.isDeleting(x, y)) {
        tileClass += ' red';
      } else if (this.isActive(x, y)) {
        tileClass += ' blue';
      }

      return tileClass;
    },
    resetGame(difficulty) {
      this.gameDifficulty = difficulty;
      this.$store.dispatch('SEND_EVENT', {
        type: 'resetGame',
        data: this.gameDifficulty
      });
    }
  },
  watch: {
    percentCompleted(newValue) {
      if (this.gameLoaded) {
        if (newValue === 100) {
          this.$store.dispatch('SEND_EVENT', {
            type: 'allTilesActive',
            data:
              this.gameDifficulty.gridSize *
              this.gameDifficulty.gridSize
          });
        }
      }
    },
    gameDifficulty(newValue) {
      this.gameLoaded = !!newValue;
    }
  }
};
</script>

<style scoped>
.game {
  position: relative;
  width: 640px;
}

.board {
  width: 640px;
  height: 640px;
}

.overlay {
  position: absolute;
  top: calc(50% - 24px);
  width: 100%;
}

</style>
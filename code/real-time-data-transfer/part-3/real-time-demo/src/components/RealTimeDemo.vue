<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <chat />
      </v-col>
      <v-col cols="8">
        <game />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chat from './Chat';
import Game from './Game';

export default {
  name: 'RealTimeDemo',
  components: {
    Chat,
    Game
  }
}
</script>

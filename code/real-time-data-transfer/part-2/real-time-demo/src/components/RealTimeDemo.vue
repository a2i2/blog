<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <chat />
      </v-col>
      <v-col cols="8">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chat from './Chat';

export default {
  name: 'RealTimeDemo',
  components: {
    Chat
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <chat />
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

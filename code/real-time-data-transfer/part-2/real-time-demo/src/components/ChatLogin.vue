<template>
  <v-card-text>
    <v-text-field
      v-model="username"
      placeholder="Enter a username"
      @keydown.enter="setUsername()"
    ></v-text-field>
    <v-btn block @click="setUsername()">
      Connect
    </v-btn>
  </v-card-text>
</template>

<script>
export default {
  name: 'ChatLogin',
  data: () => ({
    username: ''
  }),
  methods: {
    setUsername() {
      this.$emit('set-username', this.username);
    }
  }
}
</script>
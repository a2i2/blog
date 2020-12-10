<template>
  <v-card-text>
    <v-textarea
      v-model="newMessage"
      clearable
      placeholder="Send chat message"
      rows="3"
      :autofocus="true"
      :no-resize="true"
      :solo="true"
      @keydown.enter="sendMessage()"
      @keydown.enter.prevent
      @keydown="textChanged()"
    ></v-textarea>
    <v-btn block color="primary" @click="sendMessage()">
      Send
    </v-btn>
  </v-card-text>
</template>

<script>
export default {
  name: 'ChatSend',
  data: () => ({
    newMessage: ''
  }),
  methods: {
    sendMessage() {
      if (this.newMessage !== '') {
        this.$emit('send', this.newMessage);
        this.newMessage = '';
      }
    },
    textChanged() {
      this.$emit('is-typing');
    }
  }
}
</script>

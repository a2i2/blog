<template>
  <v-alert
    class="my-1"
    dense
    outlined
    text
    max-width="80%"
    :icon="false"
    :border="getSetting('border')"
    :class="getSetting('align')"
    :type="getSetting('type')"
  >
    <div v-if="message.showSender" class="overline">
      <b>{{ message.sender.uniqueName }}</b>
    </div>
    <div class="black--text">
      {{ message.text }}
    </div>
    <div class="text-right time">
      {{ formatTime(message.time) }}
    </div>
  </v-alert>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    messageSettings: {
      received: {
        align: 'align-self-start',
        border: 'left',
        type: 'error'
      },
      sent: {
        align: 'align-self-end',
        border: 'right',
        type: 'info'
      },
      server: {
        align: 'align-self-center',
        border: 'left',
        type: 'warning'
      }
    }
  }),
  methods: {
    getSetting(setting) {
      return this.messageSettings[this.message.type][setting];
    },
    formatTime(time) {
      if (this.moment(time).isSame(this.moment(), 'day')) {
        return this.moment(time).format('h:mm a');
      } else {
        return this.moment(time).format('D MMMM, h:mm a');
      }
    }
  }
}
</script>

<style scoped>
.time {
  font-size: 10px;
  line-height: 10px;
}
</style>

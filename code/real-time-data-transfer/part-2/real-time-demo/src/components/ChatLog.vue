<template>
  <v-card-text>
    <v-card>
      <div
        v-chat-scroll="scrollSettings"
        class="d-flex flex-column pa-4 overflow-y-auto log"
        ref="log"
        :style="scrollHeight"
        @scroll="onScroll"
      >
        <chat-message
          v-for="message of messagesToDisplay"
          :key="message.id"
          :message="message"
        />
        <v-fab-transition>
          <v-btn
            v-if="showScrollButton"
            absolute
            class="scroll"
            color="primary"
            fab
            x-small
            @click="scrollToBottom()"
          >
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
      <v-expand-transition>
        <div v-if="hasTypingStatus" class="px-4 py-1 primary white--text caption">
          {{ formattedTypingStatus }}
        </div>
      </v-expand-transition>
    </v-card>    
  </v-card-text>
  </div>
  
</template>

<script>
import ChatMessage from './ChatMessage';

export default {
  name: 'ChatLog',
  props: {
    messages: {
      type: Array,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    typingStatus: {
      type: Object,
      required: true
    }
  },
  components: {
    ChatMessage
  },
  data: () => ({
    scrollSettings: {
      always: false,
      smooth: true
    },
    scrollDistance: 0,
    logHeight: 400,
    hasScrolled: false,
    showScrollButton: false
  }),
  computed: {
    hasTypingStatus() {
      return this.formattedTypingStatus !== '';
    },
    messagesToDisplay() {
      let lastSender = '';
      let messages = [];

      for (let message of this.messages) {
        message.type = this.getType(message);
        message.showSender = lastSender !== message.sender.uniqueName && message.type === 'received';
        messages.push(message);

        lastSender = message.sender.uniqueName;
      }

      return messages;
    },
    scrollHeight() {
      return `max-height: ${this.logHeight}px;`;
    },
    formattedTypingStatus() {
      const users = Object.values(this.typingStatus).filter((status) => {
        return status.user.uniqueName !== this.username && status.typing
      }).map(status => status.user.uniqueName);

      if (users.length === 0) {
        return '';
      }
      
      const userString = users.join(', ').replace(/,([^,]*)$/, ' and $1');

      return `${userString} ${users.length > 1 ? 'are' : 'is'} typing...`;
    }
  },
  watch: {
    messages(value) {
      // when the array of messages changes
      // check to see the log has scrolled
      if (this.hasScrolled) {
        // show the scroll button
        this.showScrollButton = true;
      }
    },
    scrollDistance(value) {
      // when the scroll distance changes
      // check to see if it is at 0
      if (value === 0) {
        // reset the scroll button
        this.hasScrolled = false;
        this.showScrollButton = false;
      }
    }
  },
  methods: {
    getType(message) {
      return message.sender === 'Server' ?
        'server' :
        message.sender.uniqueName === this.username ?
          'sent' :
          'received';
    },
    onScroll(event) {
      this.hasScrolled = true;

      // calculate how far the log has scrolled from the bottom
      this.scrollDistance = event.target.scrollHeight - event.target.scrollTop - this.logHeight;
    },
    scrollToBottom() {
      this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
    }
  }
}
</script>

<style scoped>
.log {
  scroll-behavior: smooth;
}

.scroll {
  right: 16px;
}
</style>

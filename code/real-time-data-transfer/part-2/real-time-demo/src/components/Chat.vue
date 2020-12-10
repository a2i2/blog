<template>
  <v-card class="elevation-0 grey lighten-4">
    <div v-if="!hasUser">
      <v-card-title>Connect to chat</v-card-title>
      <chat-login @set-username="setUsername" />
    </div>
    <div v-else class="elevation-1 px-4">
      <v-card-title>Connected as {{ user.uniqueName }}</v-card-title>
      <chat-log
        :messages="history"
        :username="user.uniqueName"
        :typing-status="typingStatus"
      />
      <chat-send @send="sendMessage" @is-typing="setTypingStatus" />
      <chat-users :users="users" :username="user.uniqueName" />
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { addEventListener } from '../mixins/addEventListener';
import ChatLog from './ChatLog';
import ChatLogin from './ChatLogin';
import ChatSend from './ChatSend';
import ChatUsers from './ChatUsers';

export default {
  name: 'Chat',
  mixins: [addEventListener],
  components: {
    ChatLog,
    ChatLogin,
    ChatSend,
    ChatUsers
  },
  data: () => ({
    user: undefined,
    typingStatus: {}
  }),
  computed: {
    ...mapGetters({
      CHAT_USERS: 'chat/GET_USERS',
      CHAT_HISTORY: 'chat/GET_HISTORY'
    }),
    users() {
      return this.CHAT_USERS ? this.CHAT_USERS : [];
    },
    history() {
      return this.CHAT_HISTORY ? this.CHAT_HISTORY : [];
    },
    hasUser() {
      return !!this.user;
    }
  },
  mounted() {    
    this.addEventListener('userList', (users) => {
      this.$store.dispatch('chat/RECEIVE_USERS', users);
    });

    this.addEventListener('userConnected', (user) => {
      this.$store.dispatch('chat/RECEIVE_USER', user);
    });

    this.addEventListener('userLogin', (user) => {
      this.user = user;
    });

    this.addEventListener('chatHistory', (history) => {
      this.$store.dispatch('chat/RECEIVE_HISTORY', history);
    });

    this.addEventListener('chatMessage', (message) => {
      this.$store.dispatch('chat/RECEIVE_MESSAGE', message);
    });

    this.addEventListener('typingStatus', (typingStatus) => {
      this.typingStatus = typingStatus;
    });
  },
  methods: {
    setUsername(username) {
      this.$store.dispatch('SEND_EVENT', {
        type: 'userConnected',
        data: username
      });
    },
    sendMessage(message) {
      this.$store.dispatch('SEND_EVENT', {
        type: 'chatMessage',
        data: {
          sender: this.user,
          text: message
        }
      });
    },
    setTypingStatus() {
      this.$store.dispatch('SEND_EVENT', {
        type: 'setTypingStatus',
        data: {
          user: this.user
        }
      });
    }
  }
}
</script>

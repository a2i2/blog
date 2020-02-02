<template>
  <v-card class="elevation-0">
    <div v-if="!hasUsername">
      <v-card-title>
        Connect to chat
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          placeholder="Enter a username"
          @keydown.enter="setUsername()"
        ></v-text-field>
        <v-btn class="ma-2" @click="setUsername()">
          Connect
        </v-btn>
      </v-card-text>
    </div>
    <div v-else>
      <v-card-title>
        Connected as {{ username }}
      </v-card-title>
      <v-card-text>
        <div v-for="message of history" :key="message.id">
          <div v-if="message.sender === 'Server'">
            <b>{{ message.text }}</b>
          </div>
          <div v-else>
            <b>{{ getUsername(message.sender) }}:</b>
            {{ message.text }}
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMessage"
          placeholder="Send chat message"
          :autofocus="true"
          @keydown.enter="sendMessage()"
        ></v-text-field>
        <v-btn class="ma-2" @click="sendMessage()">
          Send
        </v-btn>
      </v-card-text>
      <v-card-text>
        <b>Connected users: </b>
        {{ getUserList() }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { addEventListener } from '../mixins/addEventListener';

export default {
  name: 'Chat',
  mixins: [addEventListener],
  data() {
    return {
      newMessage: '',
      username: '',
      hasUsername: false
    };
  },
  computed: {
    ...mapGetters({
      CHAT_USERS: 'chat/GET_USERS',
      CHAT_HISTORY: 'chat/GET_HISTORY'
    }),
    users() {
      return this.CHAT_USERS ? this.CHAT_USERS : {};
    },
    history() {
      return this.CHAT_HISTORY ? this.CHAT_HISTORY : {};
    }
  },
  mounted() {
    this.addEventListener('userList', (users) => {
      this.$store.dispatch('chat/RECEIVE_USERS', users);
    });

    this.addEventListener('userConnected', (user) => {
      this.$store.dispatch('chat/RECEIVE_USER', user);
    });

    this.addEventListener('chatHistory', (history) => {
      this.$store.dispatch('chat/RECEIVE_HISTORY', history);
    });

    this.addEventListener('chatMessage', (message) => {
      this.$store.dispatch('chat/RECEIVE_MESSAGE', message);
    });
  },
  methods: {
    setUsername() {
      this.hasUsername = true;

      this.$store.dispatch('SEND_EVENT', {
        type: 'userConnected',
        data: this.username
      });
    },
    getUsername(username) {
      return username === this.username ? 'You' : username;
    },
    getUserList() {
      let userList = '';

      for (let user of this.users) {
        if (user.id > 0) {
          userList += ', ';
        }

        userList += this.getUsername(user.name);
      }

      return userList;
    },
    sendMessage() {
      this.$store.dispatch('SEND_EVENT', {
        type: 'chatMessage',
        data: {
          sender: this.username,
          text: this.newMessage
        }
      });

      this.newMessage = '';
    }
  }
};
</script>

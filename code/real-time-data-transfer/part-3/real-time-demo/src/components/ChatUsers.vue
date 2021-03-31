<template>
  <div>
    <v-card-subtitle>Connected Users</v-card-subtitle>
    <v-card-text>
      <chat-user-chip
        v-for="(user, i) of usersToDisplay"
        :key="i"
        :user="user"
      />
    </v-card-text>
  </div>
</template>

<script>
import ChatUserChip from './ChatUserChip';

export default {
  name: 'ChatUsers',
  props: {
    users: {
      type: Array,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  components: {
    ChatUserChip
  },
  computed: {
    usersToDisplay() {
      let users = [];

      for (let user of this.users) {
        user.type = this.username === user.uniqueName ?
          'currentUser' :
          'otherUser';
        users.push(user);
      }

      return users;
    }
  }
}
</script>

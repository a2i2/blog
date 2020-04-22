<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="textInput"
          @keypress.enter="sendMessage()"
        ></v-text-field>
        <v-btn @click="sendMessage()">
          Send
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-4">
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Sent</th>
                  <th>Processed</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="output in serverOutput"
                  :key="output.text"
                >
                  <td>{{ output.message }}</td>
                  <td>{{ formatTime(output.sent) }}</td>
                  <td>{{ formatTime(output.processed) }}</td>
                  <td>{{ formatTime(output.received) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as socketio from '../plugins/socketio';

export default {
  name: 'RealTimeDemo',
  data: () => ({
    textInput: '',
    serverOutput: []
  }),
  mounted() {
    socketio.addEventListener({
      type: 'message',
      callback: (message) => {
        message.received = Date.now();
        this.serverOutput.push(message);
      }
    });
  },
  methods: {
    sendMessage() {
      socketio.sendEvent({
        type: 'message',
        data: {
          message: this.textInput,
          sent: Date.now()
        }
      });

      this.textInput = '';
    },
    formatTime(timestamp) {
      return this.moment(timestamp).format('h:mm:ss.SSS');
    }
  }
}
</script>

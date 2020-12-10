<template>
  <v-chip
    class="mr-2 mb-2"
    :color="chipSettings[user.type].chipColour"
  >
    <v-avatar left>
      <v-icon :color="chipSettings[user.type].iconColour">
        {{ chipSettings[user.type].icon }}
      </v-icon>
    </v-avatar>
    {{ user.uniqueName }}
  </v-chip>
</template>

<script>
export default {
  name: 'ChatUserChip',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    chipSettings: {
      currentUser: {
        chipColour: 'primary',
        icon: 'person',
        iconColour: 'white'
      },
      otherUser: {
        chipColour: 'default',
        icon: 'person',
        iconColour: 'error'
      }
    }
  })
}
</script>

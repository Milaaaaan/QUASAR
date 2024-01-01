<script setup lang="ts">
import { useUserStore } from 'src/stores/user'

defineProps({
  notifies: {
    required: true,
    type: Object,
  },
})

const useUser = useUserStore()

const seen = async (notification) => {
  notification.seen = !notification.seen
  notification.synced = false
  await useUser.update()
}
</script>

<template>
  <ul v-if="notifies.length > 0">
    <li
      v-for="notification in notifies"
      :key="notification.id"
      @click="seen(notification)"
      :class="notification.seen ? 'seen type_' + notification.type : 'type_' + notification.type"
    >
      <RouterLink @click="seen" :to="{ name: 'Friends' }">qsdf</RouterLink>
      <p>{{ notification.title }}</p>
    </li>
  </ul>
  <p v-else>No notifications yet!</p>
</template>

<style scoped lang="scss">
ul {
  margin: 1rem;
  padding: 0;

  li {
    list-style: none;
    padding: 1rem;
    background: rgba(129, 182, 223, 0.197);
    &.seen {
      background: none;
    }

    &:hover {
      background: var(--ion-color-step-50);
    }
    &.type_1 {
      border-left: 5px solid var(--ion-color-primary);
    }
  }
}

p {
  margin: 0;
  text-align: left;
}
</style>

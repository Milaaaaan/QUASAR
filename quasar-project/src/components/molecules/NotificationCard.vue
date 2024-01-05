<script setup>
import { useFetchStore } from 'src/stores/fetchData'
import helper from 'src/composables/helper'
import { useUserStore } from 'src/stores/user'

const useFetch = useFetchStore()

defineProps({
  notifies: {
    required: true,
    type: Object,
  },
})

const useUser = useUserStore()

const seen = async (notification) => {
  try {
    await useFetch.fetch(`/notifications/${notification.id}/seen`, 'put', null, true, false, true)
    notification.synced = true
  } catch (error) {
    notification.synced = false
  }

  notification.seen = !notification.seen
  notification.synced = false
  await useUser.update()
}

const remove = async (notification) => {
  try {
    await useFetch.fetch(`/notifications/${notification.id}/remove`, 'del', null, true, false, true)
    notification.synced = true
  } catch (error) {
    notification.synced = false
  }

  const index = useUser.notifications.findIndex((x) => x.id === notification.id)
  if (index !== -1) {
    useUser.notifications.splice(index, 1)
  }
  await useUser.update()
}
</script>

<template>
  <q-list class="pad" separator v-if="notifies.length > 0">
    <q-item-label header>Notifications</q-item-label>

    <q-item
      :to="{ name: 'Friends' }"
      clickable
      v-ripple
      v-for="notification in notifies"
      :key="notification.id"
      @click="seen(notification)"
      :class="notification.seen ? 'seen type_' + notification.type : 'type_' + notification.type"
    >
      <q-item-section>
        <q-item-label>{{ notification.title }}</q-item-label>
        <q-item-label caption>{{ helper.getTimeAgo(notification.created_at) }} </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-btn
          v-if="notification.type == 1"
          @click.prevent="remove(notification)"
          color="negative"
          icon="delete"
          size="sm"
          round
          dense
          flat
        />
      </q-item-section>
    </q-item>
  </q-list>
  <p v-else>No notifications yet!</p>
</template>

<style scoped lang="scss">
.type_1 {
  background: rgba(129, 182, 223, 0.197);

  border-left: 5px solid $primary;
}

.pad {
  padding: 1rem;
}

.seen {
  background: none;
  border-left: 5px solid $text;
}

.body--dark #q-app {
  .seen {
    background: none;
    border-left: 5px solid $step-50;
  }
}

p {
  margin: 0;
  text-align: left;
}
</style>

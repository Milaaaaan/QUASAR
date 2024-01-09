<script setup>
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import FriendCard from 'src/components/molecules/FriendCard.vue'

const useUser = useUserStore()

const requests = computed(() => {
  return useUser.friends.filter((friend) => !friend.friend && friend.requested && friend.user1_id != useUser.user.id)
})

const friends = computed(() => {
  return useUser.friends.filter((friend) => friend.friend)
})

const others = computed(() => {
  return useUser.friends.filter((friend) => (!friend.friend && friend.user1_id == useUser.user.id) || !friend.requested)
})
</script>

<template>
  <q-page>
    <section class="card default" v-if="$route.name == 'Friends' && useUser.friends">
      <FriendCard v-if="requests.length > 0" :friends="requests" label="Friend requests" />
      <FriendCard :friends="friends" label="Friends" />
      <FriendCard :friends="others" label="Others" />
    </section>

    <RouterView v-else />
  </q-page>
</template>

<style scoped lang="scss">
.flex {
  display: flex !important;
  gap: 1rem;
}
section.default {
  padding: 0;
}

.card {
  background-color: $card;
}
</style>

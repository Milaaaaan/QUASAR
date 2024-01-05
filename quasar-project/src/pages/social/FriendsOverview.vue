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
  return useUser.friends.filter((friend) => !friend.friend && friend.user1_id == useUser.user.id || !friend.requested)
})

</script>

<template>
  <q-page>
    <section class="default" v-if="$route.name == 'Friends' && useUser.friends">
      <div v-if="requests.length > 0">

      </div>

      <FriendCard :friends="requests" label="Friend requests" />
      <FriendCard :friends="friends" label="Friends" />
      <FriendCard :friends="others" label="Others" />
    </section>

    <RouterView v-else></RouterView>
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
</style>

<script setup>
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import FriendCard from 'src/components/molecules/FriendCard.vue'

const loading = computed(() => (useUser.friends ? false : true))
const useUser = useUserStore()

const requests = computed(() => {
  if (!useUser.friends) return null
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
    <section class="card default" v-if="$route.name == 'Friends'">
      <q-btn class="action" dense rounded color="primary" icon="add" to="/social/friends/add" />
      <div v-if="!loading">
        <FriendCard v-if="requests.length > 0" requested :friends="requests" label="Friend requests" />
        <FriendCard v-if="friends.length > 0" :friends="friends" label="Friends" />
        <h3 v-else>No friends yet 😞</h3>
        <FriendCard :friends="others" label="Others" />
      </div>
      <div v-else>
        <q-list>
          <q-item-label header><q-skeleton type="rect" width="100px" /></q-item-label>

          <q-intersection v-for="x in 7" :key="x" transition="scale">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="65%" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-intersection>
        </q-list>

        <q-list>
          <q-item-label header><q-skeleton type="rect" width="100px" /></q-item-label>

          <q-intersection v-for="x in 7" :key="x" transition="scale">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="65%" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-intersection>
        </q-list>
      </div>
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

.action {
  position: absolute;
  width: max-content;
  flex-wrap: wrap;
  right: 0.5rem;
  top: 0.5rem;
}

h3 {
  text-align: center;
}

.q-intersection {
  height: 5rem;
}
.card {
  background-color: $card;
}
</style>

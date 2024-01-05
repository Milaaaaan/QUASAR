<script setup>
import { useUserStore } from 'src/stores/user'
import { usePopUpStore } from 'src/stores/popup'
import img from 'src/assets/nopfp.jpg'
import { computed } from 'vue'
import { useFetchStore } from 'src/stores/fetchData'
import helper from 'src/composables/helper'
import FriendCard from 'src/components/molecules/FriendCard.vue'

const useUser = useUserStore()
const usePopUp = usePopUpStore()
const useFetch = useFetchStore()

const requests = computed(() => {
  return useUser.friends.filter((friend) => !friend.friend && friend.requested)
})

const friends = computed(() => {
  return useUser.friends.filter((friend) => friend.friend)
})

const others = computed(() => {
  return useUser.friends.filter((friend) => !friend.friend && !friend.requested)
})

const openPopUP = (details) => {
  usePopUp.type = 'friend'
  usePopUp.details = details
  usePopUp.open = true
}

const acceptFriend = async (x) => {
  try {
    const friend = await useFetch.fetch('/friends/accept', 'post', { id: x.id }, true)
    const index = useUser.friends.findIndex((request) => request.id === x.id)
    x.friend = true
    if (index !== -1) {
      useUser.friends[index] = x
    }
    useUser.update()
  } catch {}
}

const declineFriend = async () => {}
</script>

<template>
  <q-page>
    <section class="default" v-if="$route.name == 'Friends' && useUser.friends">
      <div v-if="requests.length > 0">
        <q-list>
          <q-item-label header>Friend requests</q-item-label>
          <div v-for="(friend, index) in requests" :key="index" :details="friend">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="friend.profile_picuture ? friend.profile_picuture : img" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ friend.name }}</q-item-label>
                <q-item-label lines="2" class="flex">
                  <q-btn
                    size="xx-small"
                    color="negative"
                    dense
                    icon="delete"
                    label="Decline"
                    @click="declineFriend(friend)"
                  />
                  <q-btn
                    size="xx-small"
                    color="positive"
                    dense
                    icon="done"
                    label="Accept"
                    @click="acceptFriend(friend)"
                  />
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label lines="1">€{{ friend.user1_debt }} </q-item-label>
                <q-item-label lines="2"> Owed </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset="item" />
          </div>
        </q-list>
      </div>

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

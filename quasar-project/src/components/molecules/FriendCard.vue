<script setup>
import helper from 'src/composables/helper'
import img from 'src/assets/nopfp.jpg'
import { usePopUpStore } from 'src/stores/popup'
import { useUserStore } from 'src/stores/user'
import { useFetchStore } from 'src/stores/fetchData'

const usePopUp = usePopUpStore()
const useFetch = useFetchStore()
const useUser = useUserStore()
const props = defineProps({
  friends: {
    required: true,
    type: Object,
  },
  label: {
    required: true,
    type: String,
  },
})

const owed = (friend) => {
  if (friend.user1_debt < 0) return 'Owed'
  else if (friend.user1_debt == 0) return 'Even'
  else return 'Owes you'
}

const openPopUP = (details) => {
  usePopUp.type = 'friend'
  usePopUp.details = details
  usePopUp.open = true
}

const acceptFriend = async (x) => {
  await useFetch.fetch('/friends/accept', 'post', { id: x.friend_id }, true, true, false)
  const index = useUser.friends.findIndex((request) => request.friend_id === x.friend_id)
  x.friend = true
  if (index !== -1) {
    useUser.friends[index].requested = x
  }
  useUser.update()
}

const declineFriend = async (x) => {
  await useFetch.fetch(`/friends/remove/${x.friend_id}`, 'del', null, true, true, false)
  const index = useUser.friends.findIndex((request) => request.friend_id === x.friend_id)
  if (index !== -1) {
    useUser.friends[index].requested = false
  }
  useUser.update()
}
</script>

<template>
  <q-list>
    <q-item-label header>{{ label }}</q-item-label>
    <div v-for="(friend, index) in friends" :key="index">
      <q-item clickable v-ripple @click="openPopUP(friend)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="friend.profile_picuture ? friend.profile_picuture : img" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ friend.name }}</q-item-label>
          <q-item-label
            v-if="friend.requested && !friend.friend && friend.user1_id != useUser.user.id"
            lines="2"
            class="flex"
          >
            <q-btn
              size="xx-small"
              color="negative"
              dense
              icon="delete"
              label="Decline"
              @click="declineFriend(friend)"
            />
            <q-btn size="xx-small" color="positive" dense icon="done" label="Accept" @click="acceptFriend(friend)" />
          </q-item-label>
        </q-item-section>

        <q-item-section :class="owed(friend)" side top>
          <q-item-label lines="1">{{ helper.formatPrice(friend.user1_debt) }} </q-item-label>
          <q-item-label lines="2"> {{ owed(friend) }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator inset="item" />
    </div>
  </q-list>
</template>

<style scoped lang="scss">
.column {
  align-content: start;
}

.flex {
  display: flex !important;
  flex-direction: row;
  gap: 1rem;
}

.Owed {
  color: $negative !important;
}

.Owes {
  color: $positive !important;
}
</style>

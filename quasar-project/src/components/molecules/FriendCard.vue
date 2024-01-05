<script setup>
import helper from 'src/composables/helper'
import img from 'src/assets/nopfp.jpg'
import { usePopUpStore } from 'src/stores/popup'

const usePopUp = usePopUpStore()
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

.Owed {
  color: $negative !important;
}

.Owes {
  color: $positive !important;
}
</style>
